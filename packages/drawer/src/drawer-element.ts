import { AriaWebElement } from "@ariaui-web/utils";
import { createPortalElement } from "@ariaui-web/portal";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (value) element.setAttribute(attribute, "");
  else element.removeAttribute(attribute);
}

function isFalseAttributeValue(value: string | null) {
  return value === "false";
}

function canRestoreFocusTo(element: HTMLElement | null): element is HTMLElement {
  if (!element || !element.isConnected || element.hasAttribute("disabled")) return false;
  return !("disabled" in element && Boolean((element as HTMLButtonElement).disabled));
}

function isDisabledElement(element: HTMLElement) {
  return element.hasAttribute("disabled") || ("disabled" in element && Boolean((element as HTMLButtonElement).disabled));
}

const drawerComposedAttributes = new Set([
  "aria-describedby",
  "aria-hidden",
  "aria-labelledby",
  "aria-modal",
  "data-drawer-content",
  "data-example-part",
  "data-part",
  "data-package",
  "data-side",
  "data-state",
  "data-ariaui-web",
  "force-mount",
  "part",
  "role",
  "side",
  "tabindex",
  "title",
  "type",
]);
const drawerScrollKeys = new Set(["PageDown", "PageUp", "ArrowDown", "ArrowUp", "End", "Home", " "]);
const drawerSides = new Set(["top", "right", "bottom", "left"]);
const drawerPortalledElementRoots = new WeakMap<Element, HTMLElement>();
const drawerRootPortalledElements = new WeakMap<Element, Set<HTMLElement>>();
const drawerPortalHosts = new WeakMap<HTMLElement, HTMLElement>();

let drawerId = 0;
let drawerScrollLockDocument: Document | null = null;
let drawerPreviousBodyOverflow = "";
const scrollLockedDrawerRoots = new Set<DrawerWebElement>();

export function drawerContentHost(content: HTMLElement) {
  if (!content.hasAttribute("native-composition")) return content;
  return Array.from(content.children).find((child): child is HTMLElement => child instanceof HTMLElement) ?? content;
}

function drawerOverlayHost(overlay: HTMLElement) {
  if (!overlay.hasAttribute("native-composition")) return overlay;
  return Array.from(overlay.children).find((child): child is HTMLElement => child instanceof HTMLElement) ?? overlay;
}

function syncDrawerCompositionHost(source: HTMLElement, host: HTMLElement) {
  if (host === source) return;
  for (const token of Array.from(source.classList)) host.classList.add(token);
  for (let index = 0; index < source.style.length; index += 1) {
    const property = source.style.item(index);
    host.style.setProperty(property, source.style.getPropertyValue(property), source.style.getPropertyPriority(property));
  }
  for (const attribute of Array.from(source.attributes)) {
    const name = attribute.name;
    if (name === "class" || name === "hidden" || name === "id" || name === "native-composition" || name === "style") continue;
    if (name.startsWith("aria-") || name.startsWith("data-") || drawerComposedAttributes.has(name)) {
      host.setAttribute(name, attribute.value);
    }
  }
  host.removeAttribute("native-composition");
}

function resolvedDrawerSide(content: HTMLElement) {
  const side = content.getAttribute("side") ?? content.getAttribute("data-side") ?? "bottom";
  return drawerSides.has(side) ? side : "bottom";
}

function registerDrawerPortalledElement(root: HTMLElement, element: HTMLElement) {
  let elements = drawerRootPortalledElements.get(root);
  if (!elements) {
    elements = new Set();
    drawerRootPortalledElements.set(root, elements);
  }
  elements.add(element);
  drawerPortalledElementRoots.set(element, root);
  element.setAttribute("data-drawer-portaled", "");
  element.setAttribute("data-drawer-portal-root", root.id);
}

function drawerRootForElement(element: Element | null) {
  const localRoot = element?.closest("aria-drawer");
  if (localRoot instanceof HTMLElement) return localRoot;

  let current: Element | null = element;
  while (current) {
    const root = drawerPortalledElementRoots.get(current);
    if (root) return root;
    current = current.parentElement;
  }
  return null;
}

function drawerElementsForRoot(root: Element, selector: string) {
  const elements = new Set(root.querySelectorAll<HTMLElement>(selector));
  for (const portalledElement of drawerRootPortalledElements.get(root) ?? []) {
    if (portalledElement.matches(selector)) elements.add(portalledElement);
    for (const element of portalledElement.querySelectorAll<HTMLElement>(selector)) {
      elements.add(element);
    }
  }
  return Array.from(elements).filter((element) => drawerRootForElement(element) === root);
}

function drawerContentForRoot(root: Element) {
  return drawerElementsForRoot(root, "aria-drawer-content")[0] ?? null;
}

function targetIsInsideOpenDrawerContent(target: Node) {
  for (const root of scrollLockedDrawerRoots) {
    if (!root.isConnected || !root.open) continue;
    const content = root.drawerContent(root);
    if (!content) continue;
    const host = drawerContentHost(content);
    if (content.contains(target) || host.contains(target)) return true;
  }
  return false;
}

function preventDrawerScrollEvent(event: Event) {
  const target = event.target;
  if (target instanceof Node && targetIsInsideOpenDrawerContent(target)) return;
  event.preventDefault();
}

function preventDrawerKeyboardScroll(event: Event) {
  if (event instanceof KeyboardEvent && drawerScrollKeys.has(event.key)) preventDrawerScrollEvent(event);
}

function syncDrawerScrollLock(root: DrawerWebElement, open: boolean) {
  const doc = root.ownerDocument;
  if (open) {
    if (scrollLockedDrawerRoots.size === 0) {
      drawerScrollLockDocument = doc;
      drawerPreviousBodyOverflow = doc.body.style.overflow;
      doc.addEventListener("wheel", preventDrawerScrollEvent, { capture: true, passive: false });
      doc.addEventListener("touchmove", preventDrawerScrollEvent, { capture: true, passive: false });
      doc.addEventListener("keydown", preventDrawerKeyboardScroll, { capture: true });
    }
    scrollLockedDrawerRoots.add(root);
    doc.body.style.overflow = "hidden";
    return;
  }
  scrollLockedDrawerRoots.delete(root);
  if (scrollLockedDrawerRoots.size > 0 || !drawerScrollLockDocument) return;
  drawerScrollLockDocument.removeEventListener("wheel", preventDrawerScrollEvent, { capture: true });
  drawerScrollLockDocument.removeEventListener("touchmove", preventDrawerScrollEvent, { capture: true });
  drawerScrollLockDocument.removeEventListener("keydown", preventDrawerKeyboardScroll, { capture: true });
  drawerScrollLockDocument.body.style.overflow = drawerPreviousBodyOverflow;
  drawerScrollLockDocument = null;
  drawerPreviousBodyOverflow = "";
}

export class DrawerWebElement extends AriaWebElement {
  #drawerControlledOpen = false;
  #drawerDefaultOpenApplied = false;
  #drawerEventsBound = false;
  #drawerLastRestoreTarget: HTMLElement | null = null;
  #drawerObserver: MutationObserver | null = null;
  #drawerSyncing = false;
  #drawerWasOpen = false;

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "class",
      "default-open",
      "defaultopen",
      "force-mount",
      "id",
      "native-composition",
      "side",
      "style",
    ]));
  }

  override handleAriaWebClick = (event: Event) => {
    if (event.defaultPrevented) return;
    if (this.hasAttribute("disabled")) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  drawerPartName() {
    const constructor = this.constructor as typeof DrawerWebElement;
    return constructor.partName;
  }

  drawerRoot() {
    return this.drawerPartName() === "Root" ? this : drawerRootForElement(this);
  }

  drawerElements(root: Element, selector: string) {
    return drawerElementsForRoot(root, selector);
  }

  drawerContent(root: Element) {
    return drawerContentForRoot(root);
  }

  drawerElementsInContent(content: HTMLElement, selector: string) {
    const host = drawerContentHost(content);
    return Array.from(host.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-drawer-content") === content);
  }

  override afterAriaWebContractApplied() {
    this.portalDrawerContent();
    this.bindDrawerEvents();
    this.syncDrawerTreeAroundSelf();
  }

  disconnectedCallback() {
    if (this.drawerPartName() === "Root") {
      this.#drawerObserver?.disconnect();
      this.#drawerObserver = null;
      syncDrawerScrollLock(this, false);
    }
  }

  bindDrawerEvents() {
    if (this.#drawerEventsBound) return;
    const partName = this.drawerPartName();
    if (partName === "Root") this.observeDrawerTree();
    else if (partName === "Trigger") this.addEventListener("click", this.handleDrawerTriggerClick);
    else if (partName === "Action" || partName === "Cancel" || partName === "Close") this.addEventListener("click", this.handleDrawerCloseClick);
    else if (partName === "Overlay") this.addEventListener("click", this.handleDrawerOverlayClick);
    else if (partName === "Content") this.addEventListener("keydown", this.handleDrawerContentKeyDown);
    this.#drawerEventsBound = true;
  }

  observeDrawerTree() {
    if (this.#drawerObserver || typeof MutationObserver === "undefined") return;
    this.#drawerObserver = new MutationObserver(() => {
      if (!this.#drawerSyncing) this.syncDrawerTreeFromRoot();
    });
    this.#drawerObserver.observe(this, { childList: true, subtree: true });
  }

  handleDrawerTriggerClick = (event: MouseEvent) => {
    const root = this.drawerRoot();
    if (!(root instanceof DrawerWebElement)) return;
    queueMicrotask(() => {
      if (event.defaultPrevented || this.disabled || root.disabled || root.open) return;
      root.requestDrawerOpen(this);
    });
  };

  handleDrawerCloseClick = (event: MouseEvent) => {
    const root = this.drawerRoot();
    if (!(root instanceof DrawerWebElement)) return;
    queueMicrotask(() => {
      if (!event.defaultPrevented) root.requestDrawerClose(this);
    });
  };

  handleDrawerOverlayClick = (event: MouseEvent) => {
    if (event.target !== this && !this.hasAttribute("native-composition")) return;
    const root = this.drawerRoot();
    if (!(root instanceof DrawerWebElement)) return;
    queueMicrotask(() => {
      if (event.defaultPrevented) return;
      const outsideEvent = new CustomEvent("interactoutside", {
        bubbles: true,
        cancelable: true,
        detail: { originalEvent: event, source: this },
      });
      this.dispatchEvent(outsideEvent);
      if (!outsideEvent.defaultPrevented) root.requestDrawerClose(this);
    });
  };

  handleDrawerContentKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab" && drawerContentHost(this).getAttribute("role") === "dialog") {
      this.trapDrawerFocus(event);
      return;
    }
    if (event.key !== "Escape") return;
    const root = this.drawerRoot();
    if (!(root instanceof DrawerWebElement)) return;
    queueMicrotask(() => {
      if (event.defaultPrevented) return;
      const escapeEvent = new CustomEvent("escapekeydown", {
        bubbles: true,
        cancelable: true,
        detail: { originalEvent: event, source: this },
      });
      this.dispatchEvent(escapeEvent);
      if (escapeEvent.defaultPrevented) return;
      event.preventDefault();
      root.requestDrawerClose(this);
    });
  };

  trapDrawerFocus(event: KeyboardEvent) {
    const focusableElements = this.drawerFocusableElements(this);
    if (focusableElements.length === 0) return;
    const activeElement = this.ownerDocument.activeElement as HTMLElement | null;
    const currentIndex = activeElement ? focusableElements.indexOf(activeElement) : -1;
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1)
      : (currentIndex === -1 || currentIndex === focusableElements.length - 1 ? 0 : currentIndex + 1);
    event.preventDefault();
    focusableElements[nextIndex]?.focus();
  }

  drawerFocusableElements(content: HTMLElement) {
    const host = drawerContentHost(content);
    return Array.from(host.querySelectorAll<HTMLElement>(
      "aria-drawer-cancel, aria-drawer-action, aria-drawer-close, aria-drawer-trigger, button, [href], input:not([type='hidden']), select, textarea, [tabindex]:not([tabindex='-1'])",
    )).filter((element) => !element.hidden && !isDisabledElement(element));
  }

  syncDrawerTreeAroundSelf() {
    const root = this.drawerRoot();
    if (root instanceof DrawerWebElement) root.syncDrawerTreeFromRoot();
  }

  syncDrawerTreeFromRoot() {
    if (this.drawerPartName() !== "Root" || this.#drawerSyncing || !this.isConnected) return;
    this.#drawerSyncing = true;
    try {
      const root = this;
      if (!this.#drawerDefaultOpenApplied) {
        this.#drawerControlledOpen = root.hasAttribute("open");
        this.#drawerDefaultOpenApplied = true;
        const defaultOpen = root.getAttribute("default-open") ?? root.getAttribute("defaultopen");
        if (!this.#drawerControlledOpen && defaultOpen != null && !isFalseAttributeValue(defaultOpen)) root.setAttribute("open", "");
      }

      if (!root.id) root.id = "ariaui-drawer-" + ++drawerId + "-root";
      for (const portal of this.drawerElements(root, "aria-drawer-portal")) {
        if (portal instanceof DrawerWebElement) portal.portalDrawerContent();
      }
      const isOpen = root.hasAttribute("open");
      const state = isOpen ? "open" : "closed";
      const openedNow = isOpen && !this.#drawerWasOpen;
      const closedNow = !isOpen && this.#drawerWasOpen;
      const content = this.drawerContent(root);
      const contentHost = content ? this.syncDrawerContent(content, isOpen, state) : null;

      root.setAttribute("data-state", state);
      root.removeAttribute("aria-expanded");

      for (const trigger of this.drawerElements(root, "aria-drawer-trigger")) {
        if (!trigger.hasAttribute("type")) trigger.setAttribute("type", "button");
        setBooleanAttribute(trigger, "open", isOpen);
        trigger.setAttribute("aria-expanded", String(isOpen));
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("data-state", state);
        if (contentHost && isOpen) trigger.setAttribute("aria-controls", contentHost.id);
        else trigger.removeAttribute("aria-controls");
      }

      for (const action of this.drawerElements(root, "aria-drawer-action")) {
        action.setAttribute("data-drawer-action", "");
        if (!action.hasAttribute("type")) action.setAttribute("type", "button");
      }
      for (const cancel of this.drawerElements(root, "aria-drawer-cancel")) {
        cancel.setAttribute("data-drawer-cancel", "");
        if (!cancel.hasAttribute("type")) cancel.setAttribute("type", "button");
      }
      for (const close of this.drawerElements(root, "aria-drawer-close")) {
        if (!close.hasAttribute("type")) close.setAttribute("type", "button");
      }
      for (const portal of this.drawerElements(root, "aria-drawer-portal")) {
        portal.setAttribute("data-state", state);
        portal.hidden = !isOpen && !portal.hasAttribute("force-mount");
      }
      for (const overlay of this.drawerElements(root, "aria-drawer-overlay")) this.syncDrawerOverlay(overlay, isOpen, state);

      if (openedNow && !this.#drawerLastRestoreTarget) {
        this.#drawerLastRestoreTarget = this.ownerDocument.activeElement instanceof HTMLElement ? this.ownerDocument.activeElement : null;
      }
      this.#drawerWasOpen = isOpen;
      syncDrawerScrollLock(this, isOpen);
      if (openedNow) queueMicrotask(() => this.isConnected && this.open && this.focusInitialDrawerTarget());
      if (closedNow) queueMicrotask(() => this.isConnected && !this.open && this.restoreDrawerFocus());
    } finally {
      this.#drawerSyncing = false;
    }
  }

  syncDrawerOverlay(overlay: HTMLElement, isOpen: boolean, state: string) {
    const host = drawerOverlayHost(overlay);
    const forceMount = overlay.hasAttribute("force-mount") || host.hasAttribute("force-mount");
    syncDrawerCompositionHost(overlay, host);
    setBooleanAttribute(host, "open", isOpen);
    host.setAttribute("data-state", state);
    host.hidden = !isOpen && !forceMount;
    if (host !== overlay) {
      overlay.setAttribute("data-state", state);
      overlay.hidden = !isOpen && !forceMount;
    }
    return host;
  }

  syncDrawerContent(content: HTMLElement, isOpen: boolean, state: string) {
    const host = drawerContentHost(content);
    const forceMount = content.hasAttribute("force-mount") || host.hasAttribute("force-mount");
    const existingId = host === content ? content.id : host.id || content.id;
    const side = resolvedDrawerSide(content);
    if (!host.id) host.id = existingId || "ariaui-drawer-" + ++drawerId + "-content";
    syncDrawerCompositionHost(content, host);
    host.removeAttribute("open");
    host.setAttribute("data-drawer-content", "");
    host.setAttribute("data-state", state);
    host.setAttribute("data-side", side);
    host.removeAttribute("data-direction");
    host.hidden = !isOpen && !forceMount;

    const titles = this.drawerElementsInContent(content, "aria-drawer-title");
    const descriptions = this.drawerElementsInContent(content, "aria-drawer-description");
    for (const title of titles) {
      if (!title.id) title.id = "ariaui-drawer-" + ++drawerId + "-title";
      if (title.getAttribute("role") === "heading" && !title.hasAttribute("aria-level")) title.setAttribute("aria-level", "2");
    }
    for (const description of descriptions) {
      if (!description.id) description.id = "ariaui-drawer-" + ++drawerId + "-description";
    }

    if (isOpen) {
      host.setAttribute("role", "dialog");
      host.setAttribute("aria-modal", "true");
      host.setAttribute("tabindex", "-1");
      host.removeAttribute("aria-hidden");
      if (titles.length > 0) host.setAttribute("aria-labelledby", titles.map((title) => title.id).join(" "));
      else host.removeAttribute("aria-labelledby");
      if (descriptions.length > 0) host.setAttribute("aria-describedby", descriptions.map((description) => description.id).join(" "));
      else host.removeAttribute("aria-describedby");
    } else {
      host.removeAttribute("role");
      host.removeAttribute("aria-modal");
      host.removeAttribute("tabindex");
      host.removeAttribute("aria-labelledby");
      host.removeAttribute("aria-describedby");
      host.setAttribute("aria-hidden", "true");
    }

    if (host !== content) {
      content.removeAttribute("id");
      content.removeAttribute("open");
      content.removeAttribute("role");
      content.removeAttribute("aria-hidden");
      content.removeAttribute("aria-modal");
      content.removeAttribute("aria-labelledby");
      content.removeAttribute("aria-describedby");
      content.setAttribute("data-state", state);
      content.setAttribute("data-side", side);
      content.hidden = !isOpen && !forceMount;
    }
    return host;
  }

  requestDrawerOpen(source: Element) {
    this.#drawerLastRestoreTarget = source instanceof HTMLElement
      ? source
      : this.ownerDocument.activeElement instanceof HTMLElement ? this.ownerDocument.activeElement : null;
    this.dispatchDrawerOpenChange(true, source);
    if (this.#drawerControlledOpen) return true;
    setBooleanAttribute(this, "open", true);
    this.syncDrawerTreeFromRoot();
    return true;
  }

  requestDrawerClose(source: Element = this) {
    this.dispatchDrawerOpenChange(false, source);
    if (this.#drawerControlledOpen) return true;
    setBooleanAttribute(this, "open", false);
    this.syncDrawerTreeFromRoot();
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, detail: { source } }));
    return true;
  }

  dispatchDrawerOpenChange(open: boolean, source: Element) {
    const detail = { open, source };
    this.dispatchEvent(new CustomEvent("openchange", { bubbles: true, detail }));
    this.dispatchEvent(new CustomEvent("drawer-open-change", { bubbles: true, detail }));
  }

  focusInitialDrawerTarget() {
    const content = this.drawerContent(this);
    if (!content) return;
    const host = drawerContentHost(content);
    const event = new CustomEvent("openautofocus", { bubbles: true, cancelable: true });
    host.dispatchEvent(event);
    if (event.defaultPrevented) return;
    const target = this.drawerFocusableElements(content)[0] ?? host;
    target.focus({ preventScroll: true });
  }

  restoreDrawerFocus() {
    const content = this.drawerContent(this);
    if (content) {
      const event = new CustomEvent("closeautofocus", { bubbles: true, cancelable: true });
      drawerContentHost(content).dispatchEvent(event);
      if (event.defaultPrevented) return;
    }
    if (canRestoreFocusTo(this.#drawerLastRestoreTarget)) {
      this.#drawerLastRestoreTarget.focus({ preventScroll: true });
      return;
    }
    const trigger = this.drawerElements(this, "aria-drawer-trigger")[0] ?? null;
    if (canRestoreFocusTo(trigger)) {
      trigger.focus({ preventScroll: true });
      return;
    }
    const body = this.ownerDocument.body;
    if (!body.hasAttribute("tabindex")) body.setAttribute("tabindex", "-1");
    body.focus({ preventScroll: true });
  }

  portalDrawerContent() {
    if (this.drawerPartName() !== "Portal") return;
    const root = drawerRootForElement(this);
    if (!(root instanceof HTMLElement)) return;
    if (!root.id) root.id = "ariaui-drawer-" + ++drawerId + "-root";

    const portal = drawerPortalHosts.get(this)
      ?? this.querySelector<HTMLElement>(":scope > aria-portal[data-drawer-portal-host]")
      ?? createPortalElement();
    portal.setAttribute("data-drawer-portal-host", "");
    portal.setAttribute("data-drawer-portal-root", root.id);
    drawerPortalHosts.set(this, portal);

    const portalledElements = Array.from(this.children).filter((element): element is HTMLElement => (
      element instanceof HTMLElement
      && (element.matches("aria-drawer-content") || element.matches("aria-drawer-overlay"))
    ));
    for (const element of portalledElements) {
      registerDrawerPortalledElement(root, element);
    }
    if (!portal.isConnected) this.append(portal);
    if (portalledElements.length > 0) portal.append(...portalledElements);
  }
}

export function createDrawerWebComponent(part: WebComponentPartSpec): typeof DrawerWebElement {
  return class extends DrawerWebElement {
    static override packageSlug = "drawer";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
