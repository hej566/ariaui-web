import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

function isFalseAttributeValue(value: string | null) {
  return value === "false";
}

function canRestoreFocusTo(element: HTMLElement | null): element is HTMLElement {
  if (!element || !element.isConnected || element.hasAttribute("disabled")) {
    return false;
  }

  if ("disabled" in element && Boolean((element as HTMLButtonElement).disabled)) {
    return false;
  }

  return true;
}

const inertCounts = new WeakMap<HTMLElement, number>();
let alertDialogId = 0;
let scrollLockCount = 0;
let previousBodyOverflow = "";
let previousDocumentOverflow = "";

function preventBackgroundWheel(event: WheelEvent) {
  const target = event.target;
  if (target instanceof Element && target.closest("aria-alert-dialog-content[role='alertdialog']")) {
    return;
  }

  event.preventDefault();
}

function lockViewportScroll() {
  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.addEventListener("wheel", preventBackgroundWheel, { passive: false });
  }

  scrollLockCount += 1;
}

function unlockViewportScroll() {
  if (scrollLockCount <= 0) {
    scrollLockCount = 0;
    return;
  }

  scrollLockCount -= 1;
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    document.documentElement.style.overflow = previousDocumentOverflow;
    document.body.removeEventListener("wheel", preventBackgroundWheel);
  }
}

export class AlertDialogWebElement extends AriaWebElement {
  #alertDialogControlledOpen = false;
  #alertDialogDefaultOpenApplied = false;
  #alertDialogEventsBound = false;
  #alertDialogInertedElements = new Set<HTMLElement>();
  #alertDialogLastTrigger: HTMLElement | null = null;
  #alertDialogObserver: MutationObserver | null = null;
  #alertDialogScrollLocked = false;
  #alertDialogSyncing = false;

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "default-open", "defaultopen", "force-mount"]));
  }

  alertDialogPartName() {
    const constructor = this.constructor as typeof AlertDialogWebElement;
    return constructor.partName;
  }

  alertDialogRoot() {
    return this.alertDialogPartName() === "Root" ? this : this.closest("aria-alert-dialog");
  }

  alertDialogElements(root: Element, selector: string) {
    return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-alert-dialog") === root);
  }

  alertDialogContent(root: Element) {
    return this.alertDialogElements(root, "aria-alert-dialog-content")[0] ?? null;
  }

  alertDialogElementsInContent(content: Element, selector: string) {
    return Array.from(content.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-alert-dialog-content") === content);
  }

  override afterAriaWebContractApplied() {
    this.bindAlertDialogEvents();
    this.syncAlertDialogTreeAroundSelf();
  }

  disconnectedCallback() {
    if (this.alertDialogPartName() === "Root") {
      this.releaseAlertDialogModalEffects();
      this.#alertDialogObserver?.disconnect();
      this.#alertDialogObserver = null;
    }
  }

  bindAlertDialogEvents() {
    if (this.#alertDialogEventsBound) {
      return;
    }

    const partName = this.alertDialogPartName();
    if (partName === "Root") {
      this.observeAlertDialogTree();
    } else if (partName === "Trigger") {
      this.addEventListener("click", this.handleAlertDialogTriggerClick);
    } else if (partName === "Action" || partName === "Cancel") {
      this.addEventListener("click", this.handleAlertDialogCloseClick);
    } else if (partName === "Content") {
      this.addEventListener("keydown", this.handleAlertDialogContentKeyDown);
    }

    this.#alertDialogEventsBound = true;
  }

  observeAlertDialogTree() {
    if (this.#alertDialogObserver || typeof MutationObserver === "undefined") {
      return;
    }

    this.#alertDialogObserver = new MutationObserver(() => {
      if (!this.#alertDialogSyncing) {
        this.syncAlertDialogTreeFromRoot();
      }
    });
    this.#alertDialogObserver.observe(this, { childList: true, subtree: true });
  }

  handleAlertDialogTriggerClick = (event: MouseEvent) => {
    const root = this.alertDialogRoot();
    if (!(root instanceof AlertDialogWebElement)) {
      return;
    }

    queueMicrotask(() => {
      if (!event.defaultPrevented) {
        root.requestAlertDialogOpen(this);
      }
    });
  };

  handleAlertDialogCloseClick = (event: MouseEvent) => {
    const root = this.alertDialogRoot();
    if (!(root instanceof AlertDialogWebElement)) {
      return;
    }

    queueMicrotask(() => {
      if (!event.defaultPrevented) {
        root.requestAlertDialogClose(this);
      }
    });
  };

  handleAlertDialogContentKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab" && this.getAttribute("role") === "alertdialog") {
      this.trapAlertDialogFocus(event);
      return;
    }

    if (event.key !== "Escape") {
      return;
    }

    const root = this.alertDialogRoot();
    if (!(root instanceof AlertDialogWebElement)) {
      return;
    }

    queueMicrotask(() => {
      if (event.defaultPrevented) {
        return;
      }

      const escapeEvent = new CustomEvent("escapekeydown", {
        bubbles: true,
        cancelable: true,
        detail: {
          originalEvent: event,
        },
      });
      this.dispatchEvent(escapeEvent);

      if (escapeEvent.defaultPrevented) {
        return;
      }

      event.preventDefault();
      root.requestAlertDialogClose(this);
    });
  };

  trapAlertDialogFocus(event: KeyboardEvent) {
    const focusableElements = this.alertDialogFocusableElements(this);
    if (focusableElements.length === 0) {
      return;
    }

    const activeElement = this.ownerDocument.activeElement as HTMLElement | null;
    const currentIndex = activeElement ? focusableElements.indexOf(activeElement) : -1;
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1)
      : (currentIndex === -1 || currentIndex === focusableElements.length - 1 ? 0 : currentIndex + 1);

    event.preventDefault();
    focusableElements[nextIndex]?.focus();
  }

  alertDialogFocusableElements(container: Element) {
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        "aria-alert-dialog-cancel, aria-alert-dialog-action, button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      ),
    ).filter((element) => {
      return !element.hidden && !element.hasAttribute("disabled") && (!(element as HTMLButtonElement).disabled);
    });
  }

  syncAlertDialogTreeAroundSelf() {
    const root = this.alertDialogRoot();
    if (root instanceof AlertDialogWebElement) {
      root.syncAlertDialogTreeFromRoot();
    }
  }

  syncAlertDialogTreeFromRoot() {
    if (this.alertDialogPartName() !== "Root" || this.#alertDialogSyncing || !this.isConnected) {
      return;
    }

    this.#alertDialogSyncing = true;
    try {
      const root = this;
      let shouldFocusDefaultOpen = false;
      if (!this.#alertDialogDefaultOpenApplied) {
        this.#alertDialogControlledOpen = root.hasAttribute("open");
        this.#alertDialogDefaultOpenApplied = true;

        const defaultOpen = root.getAttribute("default-open") ?? root.getAttribute("defaultopen");
        if (!this.#alertDialogControlledOpen && defaultOpen != null && !isFalseAttributeValue(defaultOpen)) {
          root.setAttribute("open", "");
          shouldFocusDefaultOpen = true;
        }
      }

      const isOpen = root.hasAttribute("open");
      const state = isOpen ? "open" : "closed";
      root.setAttribute("data-state", state);

      const content = this.alertDialogContent(root);
      const triggers = this.alertDialogElements(root, "aria-alert-dialog-trigger");
      const overlays = this.alertDialogElements(root, "aria-alert-dialog-overlay");
      const portals = this.alertDialogElements(root, "aria-alert-dialog-portal");
      const icons = this.alertDialogElements(root, "aria-alert-dialog-icon");
      const cancels = this.alertDialogElements(root, "aria-alert-dialog-cancel");

      if (content && !content.id) {
        content.id = "ariaui-alert-dialog-" + ++alertDialogId + "-content";
      }

      for (const trigger of triggers) {
        setBooleanAttribute(trigger, "open", isOpen);
        trigger.setAttribute("aria-expanded", String(isOpen));
        trigger.setAttribute("data-state", state);
      }

      for (const icon of icons) {
        icon.setAttribute("aria-hidden", "true");
      }

      for (const cancel of cancels) {
        cancel.setAttribute("data-alert-dialog-cancel", "");
      }

      if (content) {
        this.syncAlertDialogContent(root, content, isOpen, state);
      }

      for (const overlay of overlays) {
        overlay.setAttribute("data-state", state);
        overlay.hidden = !isOpen && !overlay.hasAttribute("force-mount");
      }

      for (const portal of portals) {
        portal.setAttribute("data-state", state);
        portal.hidden = !isOpen && !portal.hasAttribute("force-mount");
      }

      if (isOpen) {
        this.claimAlertDialogModalEffects();
      } else {
        this.releaseAlertDialogModalEffects();
      }

      if (shouldFocusDefaultOpen) {
        queueMicrotask(() => {
          if (this.isConnected && this.hasAttribute("open")) {
            this.focusInitialAlertDialogTarget();
          }
        });
      }
    } finally {
      this.#alertDialogSyncing = false;
    }
  }

  syncAlertDialogContent(root: Element, content: HTMLElement, isOpen: boolean, state: string) {
    content.setAttribute("data-alert-dialog-content", "");

    const titles = this.alertDialogElementsInContent(content, "aria-alert-dialog-title");
    const descriptions = this.alertDialogElementsInContent(content, "aria-alert-dialog-description");

    for (const title of titles) {
      if (!title.id) {
        title.id = "ariaui-alert-dialog-" + ++alertDialogId + "-title";
      }
      if (title.getAttribute("role") === "heading" && !title.hasAttribute("aria-level")) {
        title.setAttribute("aria-level", "2");
      }
    }

    for (const description of descriptions) {
      if (!description.id) {
        description.id = "ariaui-alert-dialog-" + ++alertDialogId + "-description";
      }
    }

    if (isOpen) {
      content.setAttribute("role", "alertdialog");
      content.setAttribute("aria-modal", "true");
      content.setAttribute("tabindex", "-1");
      content.removeAttribute("aria-hidden");

      if (titles.length > 0) {
        content.setAttribute("aria-labelledby", titles.map((title) => title.id).join(" "));
      } else {
        content.removeAttribute("aria-labelledby");
      }

      if (descriptions.length > 0) {
        content.setAttribute("aria-describedby", descriptions.map((description) => description.id).join(" "));
      } else {
        content.removeAttribute("aria-describedby");
      }
    } else {
      content.removeAttribute("role");
      content.removeAttribute("aria-modal");
      content.removeAttribute("tabindex");
      content.removeAttribute("aria-labelledby");
      content.removeAttribute("aria-describedby");
      content.setAttribute("aria-hidden", "true");
    }

    content.hidden = !isOpen;
    content.setAttribute("data-state", state);
  }

  requestAlertDialogOpen(source: Element) {
    this.#alertDialogLastTrigger = source instanceof HTMLElement ? source : null;
    this.dispatchEvent(new CustomEvent("openchange", {
      bubbles: true,
      detail: {
        open: true,
        source,
      },
    }));

    if (this.#alertDialogControlledOpen) {
      return true;
    }

    setBooleanAttribute(this, "open", true);
    this.syncAlertDialogTreeFromRoot();
    this.focusInitialAlertDialogTarget();
    return true;
  }

  requestAlertDialogClose(source: Element) {
    const content = this.alertDialogContent(this);
    this.dispatchEvent(new CustomEvent("openchange", {
      bubbles: true,
      detail: {
        open: false,
        source,
      },
    }));

    if (this.#alertDialogControlledOpen) {
      return true;
    }

    setBooleanAttribute(this, "open", false);
    this.syncAlertDialogTreeFromRoot();
    this.restoreAlertDialogFocus(content);
    return true;
  }

  focusInitialAlertDialogTarget() {
    const content = this.alertDialogContent(this);
    if (!content) {
      return;
    }

    const event = new CustomEvent("openautofocus", { bubbles: true, cancelable: true });
    content.dispatchEvent(event);
    if (event.defaultPrevented) {
      return;
    }

    const target = this.alertDialogElementsInContent(content, "aria-alert-dialog-cancel")[0]
      ?? this.alertDialogFocusableElements(content)[0]
      ?? content;
    target.focus({ preventScroll: true });
  }

  restoreAlertDialogFocus(content: HTMLElement | null) {
    if (content) {
      const event = new CustomEvent("closeautofocus", { bubbles: true, cancelable: true });
      content.dispatchEvent(event);
      if (event.defaultPrevented) {
        return;
      }
    }

    const trigger = this.#alertDialogLastTrigger ?? this.alertDialogElements(this, "aria-alert-dialog-trigger")[0] ?? null;
    if (canRestoreFocusTo(trigger)) {
      trigger.focus({ preventScroll: true });
      return;
    }

    if (!document.body.hasAttribute("tabindex")) {
      document.body.setAttribute("tabindex", "-1");
    }
    document.body.focus({ preventScroll: true });
  }

  claimAlertDialogModalEffects() {
    if (this.#alertDialogScrollLocked) {
      return;
    }

    const parent = this.parentElement;
    if (parent) {
      for (const sibling of Array.from(parent.children)) {
        if (!(sibling instanceof HTMLElement) || sibling === this || sibling.matches("aria-alert-dialog")) {
          continue;
        }

        const count = inertCounts.get(sibling) ?? 0;
        inertCounts.set(sibling, count + 1);
        sibling.setAttribute("inert", "");
        this.#alertDialogInertedElements.add(sibling);
      }
    }

    lockViewportScroll();
    this.#alertDialogScrollLocked = true;
  }

  releaseAlertDialogModalEffects() {
    for (const element of this.#alertDialogInertedElements) {
      const count = (inertCounts.get(element) ?? 1) - 1;
      if (count <= 0) {
        inertCounts.delete(element);
        element.removeAttribute("inert");
      } else {
        inertCounts.set(element, count);
      }
    }
    this.#alertDialogInertedElements.clear();

    if (this.#alertDialogScrollLocked) {
      unlockViewportScroll();
      this.#alertDialogScrollLocked = false;
    }
  }
}

export function createAlertDialogWebComponent(part: WebComponentPartSpec): typeof AlertDialogWebElement {
  return class extends AlertDialogWebElement {
    static override packageSlug = "alert-dialog";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
