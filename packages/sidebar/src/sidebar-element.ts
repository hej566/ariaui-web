import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

const composedParts = new Set(["Panel", "Trigger", "GroupLabel", "GroupAction", "MenuButton", "MenuAction", "MenuSubButton"]);
const buttonParts = new Set(["Trigger", "Rail", "GroupAction", "MenuButton", "MenuAction", "MenuSubButton"]);
const slotNames: Record<string, string> = {
  Panel: "sidebar", Trigger: "sidebar-trigger", Rail: "sidebar-rail", Inset: "sidebar-inset",
  Header: "sidebar-header", Content: "sidebar-content", Footer: "sidebar-footer", Group: "sidebar-group",
  GroupLabel: "sidebar-group-label", GroupAction: "sidebar-group-action", GroupContent: "sidebar-group-content",
  Menu: "sidebar-menu", MenuItem: "sidebar-menu-item", MenuButton: "sidebar-menu-button",
  MenuAction: "sidebar-menu-action", MenuBadge: "sidebar-menu-badge", MenuSub: "sidebar-menu-sub",
  MenuSubItem: "sidebar-menu-sub-item", MenuSubButton: "sidebar-menu-sub-button",
};

let panelSequence = 0;

function booleanAttribute(element: Element, name: string, fallback = false) {
  if (!element.hasAttribute(name)) return fallback;
  return element.getAttribute(name) !== "false";
}

function setBooleanAttribute(element: Element, name: string, value: boolean) {
  if (value) element.setAttribute(name, "");
  else element.removeAttribute(name);
}

function composedHost(element: HTMLElement) {
  if (!element.hasAttribute("native-composition")) return element;
  return Array.from(element.children).find((child): child is HTMLElement => child instanceof HTMLElement) ?? element;
}

export class SidebarWebElement extends AriaWebElement {
  #initialized = false;
  #controlled = false;
  #uncontrolledOpen = true;
  #observer: MutationObserver | null = null;
  #windowBound = false;
  #syncing = false;

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "class", "default-open", "defaultopen", "keyboard-shortcut", "keyboardshortcut", "native-composition", "panel-id", "panelid", "show-on-hover", "side", "size", "style", "variant"]));
  }

  override handleAriaWebClick = (event: Event) => {
    if (event.defaultPrevented) return;
    if (this.hasAttribute("disabled")) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null) {
    if (name === "open" && this.partName() === "Root" && this.#initialized) this.#controlled = true;
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  partName() {
    return (this.constructor as typeof SidebarWebElement).partName;
  }

  root() {
    return this.partName() === "Root" ? this : this.closest("aria-sidebar");
  }

  override afterAriaWebContractApplied() {
    if (this.partName() === "Root") this.initializeRoot();
    else if (this.partName() === "Trigger" || this.partName() === "Rail") this.addToggleListener();
    const root = this.root();
    if (root instanceof SidebarWebElement) root.syncTree();
  }

  disconnectedCallback() {
    if (this.partName() !== "Root") return;
    this.#observer?.disconnect();
    this.#observer = null;
    if (this.#windowBound) window.removeEventListener("keydown", this.handleShortcut);
    this.#windowBound = false;
  }

  initializeRoot() {
    if (!this.#initialized) {
      this.#controlled = this.hasAttribute("open");
      this.#uncontrolledOpen = booleanAttribute(this, "default-open", booleanAttribute(this, "defaultopen", true));
      this.#initialized = true;
    }
    if (!this.isConnected) return;
    if (!this.#observer && typeof MutationObserver !== "undefined") {
      this.#observer = new MutationObserver(() => this.syncTree());
      this.#observer.observe(this, { childList: true, subtree: true });
    }
    if (!this.#windowBound) {
      window.addEventListener("keydown", this.handleShortcut);
      this.#windowBound = true;
    }
  }

  addToggleListener() {
    if (this.dataset.sidebarToggleBound) return;
    this.dataset.sidebarToggleBound = "";
    this.addEventListener("click", this.handleToggleClick);
  }

  handleToggleClick = (event: Event) => {
    queueMicrotask(() => {
      if (event.defaultPrevented || this.disabled) return;
      const root = this.root();
      if (root instanceof SidebarWebElement) root.requestOpenChange(!root.currentOpen(), this);
    });
  };

  handleShortcut = (event: KeyboardEvent) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    const shortcut = this.getAttribute("keyboard-shortcut") ?? this.getAttribute("keyboardshortcut") ?? "b";
    if (!shortcut || shortcut === "none" || event.key.toLowerCase() !== shortcut.toLowerCase()) return;
    event.preventDefault();
    this.requestOpenChange(!this.currentOpen(), this);
  };

  currentOpen() {
    if ((this.getAttribute("collapsible") ?? "icon") === "none") return true;
    return this.#controlled ? booleanAttribute(this, "open") : this.#uncontrolledOpen;
  }

  requestOpenChange(open: boolean, source: HTMLElement) {
    if ((this.getAttribute("collapsible") ?? "icon") === "none" || this.disabled) return;
    const event = new CustomEvent("open-change", { bubbles: true, cancelable: true, detail: { open, source } });
    if (!this.dispatchEvent(event)) return;
    if (!this.#controlled) {
      this.#uncontrolledOpen = open;
      this.syncTree();
    }
  }

  syncTree() {
    if (this.partName() !== "Root" || !this.#initialized || this.#syncing || !this.isConnected) return;
    this.#syncing = true;
    try {
      const open = this.currentOpen();
      const state = open ? "expanded" : "collapsed";
      const side = this.getAttribute("side") ?? "left";
      const collapsible = this.getAttribute("collapsible") ?? "icon";
      this.setAttribute("data-state", state);
      this.setAttribute("data-side", side);
      this.setAttribute("data-collapsible", collapsible);

      const parts = [this, ...Array.from(this.querySelectorAll("[data-ariaui-web='sidebar']")).filter((part): part is SidebarWebElement => part instanceof SidebarWebElement)];
      const panel = parts.find((part) => part.partName() === "Panel");
      const panelHost = panel ? composedHost(panel) : null;
      const requestedId = this.getAttribute("panel-id") ?? this.getAttribute("panelid");
      if (panelHost && requestedId) panelHost.id = requestedId;
      else if (panelHost && !panelHost.id) panelHost.id = `ariaui-sidebar-${++panelSequence}`;
      if (panel && panelHost !== panel) panel.removeAttribute("id");

      for (const part of parts) this.syncPart(part, open, state, side, collapsible, panelHost?.id ?? "");
    } finally {
      this.#syncing = false;
    }
  }

  syncPart(part: SidebarWebElement, open: boolean, state: string, side: string, collapsible: string, panelId: string) {
    const name = part.partName();
    if (name !== "Root") {
      part.setAttribute("data-sidebar", name === "Panel" ? "sidebar" : name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase());
      part.setAttribute("data-slot", slotNames[name] ?? "");
    }
    if (["Panel", "Trigger", "Rail", "MenuButton", "MenuSubButton"].includes(name)) part.setAttribute("data-state", state);
    if (["Panel", "Trigger", "Rail"].includes(name)) {
      part.setAttribute("data-side", side);
      part.setAttribute("data-collapsible", collapsible);
    }
    if (buttonParts.has(name) && !part.hasAttribute("type")) part.setAttribute("type", "button");
    if (name === "Trigger" || name === "Rail") {
      setBooleanAttribute(part, "open", open);
      part.setAttribute("aria-expanded", String(open));
      if (panelId) part.setAttribute("aria-controls", panelId);
      if (!part.hasAttribute("aria-label")) part.setAttribute("aria-label", "Toggle Sidebar");
      part.setAttribute("data-state", state);
    }
    if (name === "MenuButton" || name === "MenuSubButton") {
      part.setAttribute("data-active", String(booleanAttribute(part, "active")));
      part.setAttribute("data-size", part.getAttribute("size") ?? "default");
    }
    if (name === "MenuButton") part.setAttribute("data-variant", part.getAttribute("variant") ?? "default");
    if (name === "MenuAction") setBooleanAttribute(part, "data-show-on-hover", booleanAttribute(part, "show-on-hover"));
    if (composedParts.has(name)) this.syncComposition(part);
  }

  syncComposition(part: SidebarWebElement) {
    const host = composedHost(part);
    if (host === part) return;
    for (const token of part.classList) host.classList.add(token);
    for (let index = 0; index < part.style.length; index += 1) {
      const property = part.style.item(index);
      host.style.setProperty(property, part.style.getPropertyValue(property), part.style.getPropertyPriority(property));
    }
    for (const attribute of Array.from(part.attributes)) {
      if (["class", "id", "native-composition", "style"].includes(attribute.name)) continue;
      if (attribute.name.startsWith("aria-") || attribute.name.startsWith("data-") || ["disabled", "part", "role", "tabindex", "type"].includes(attribute.name)) host.setAttribute(attribute.name, attribute.value);
    }
    part.removeAttribute("role");
    part.removeAttribute("tabindex");
  }
}

export function createSidebarWebComponent(part: WebComponentPartSpec): typeof SidebarWebElement {
  return class extends SidebarWebElement {
    static override packageSlug = "sidebar";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
