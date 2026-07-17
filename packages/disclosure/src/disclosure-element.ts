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

const disclosureComposedAttributes = new Set([
  "aria-controls",
  "aria-expanded",
  "aria-hidden",
  "data-state",
  "data-example-part",
  "data-part",
  "data-package",
  "data-ariaui-web",
  "force-mount",
  "part",
  "role",
  "tabindex",
  "title",
  "type",
  "value",
]);

let disclosureId = 0;

export function disclosureContentHost(content: HTMLElement) {
  if (!content.hasAttribute("native-composition")) {
    return content;
  }

  return Array.from(content.children).find((child): child is HTMLElement => child instanceof HTMLElement) ?? content;
}

function syncDisclosureCompositionHost(content: HTMLElement, host: HTMLElement) {
  if (host === content) {
    return;
  }

  for (const token of Array.from(content.classList)) {
    host.classList.add(token);
  }

  for (let index = 0; index < content.style.length; index += 1) {
    const property = content.style.item(index);
    host.style.setProperty(property, content.style.getPropertyValue(property), content.style.getPropertyPriority(property));
  }

  for (const attribute of Array.from(content.attributes)) {
    const name = attribute.name;
    if (name === "class" || name === "hidden" || name === "id" || name === "native-composition" || name === "style") {
      continue;
    }

    if (name.startsWith("aria-") || name.startsWith("data-") || disclosureComposedAttributes.has(name)) {
      host.setAttribute(name, attribute.value);
    }
  }

  host.removeAttribute("native-composition");
}

export class DisclosureWebElement extends AriaWebElement {
  #disclosureControlledOpen = false;
  #disclosureDefaultOpenApplied = false;
  #disclosureEventsBound = false;
  #disclosureObserver: MutationObserver | null = null;
  #disclosureSyncing = false;

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "class",
      "default-open",
      "defaultopen",
      "id",
      "native-composition",
      "style",
    ]));
  }

  override handleAriaWebClick = (event: Event) => {
    if (event.defaultPrevented) {
      return;
    }

    if (this.hasAttribute("disabled")) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  disclosurePartName() {
    const constructor = this.constructor as typeof DisclosureWebElement;
    return constructor.partName;
  }

  disclosureRoot() {
    return this.disclosurePartName() === "Root" ? this : this.closest("aria-disclosure");
  }

  disclosureElements(root: Element, selector: string) {
    return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-disclosure") === root);
  }

  disclosureContent(root: Element) {
    return this.disclosureElements(root, "aria-disclosure-content")[0] ?? null;
  }

  override afterAriaWebContractApplied() {
    this.bindDisclosureEvents();
    this.syncDisclosureTreeAroundSelf();
  }

  disconnectedCallback() {
    if (this.disclosurePartName() === "Root") {
      this.#disclosureObserver?.disconnect();
      this.#disclosureObserver = null;
    }
  }

  bindDisclosureEvents() {
    if (this.#disclosureEventsBound) {
      return;
    }

    if (this.disclosurePartName() === "Root") {
      this.observeDisclosureTree();
    } else if (this.disclosurePartName() === "Trigger") {
      this.addEventListener("click", this.handleDisclosureTriggerClick);
    }

    this.#disclosureEventsBound = true;
  }

  observeDisclosureTree() {
    if (this.#disclosureObserver || typeof MutationObserver === "undefined") {
      return;
    }

    this.#disclosureObserver = new MutationObserver(() => {
      if (!this.#disclosureSyncing) {
        this.syncDisclosureTreeFromRoot();
      }
    });
    this.#disclosureObserver.observe(this, { childList: true, subtree: true });
  }

  handleDisclosureTriggerClick = (event: MouseEvent) => {
    const root = this.disclosureRoot();
    if (!(root instanceof DisclosureWebElement)) {
      return;
    }

    queueMicrotask(() => {
      if (event.defaultPrevented || this.disabled || root.disabled) {
        return;
      }

      root.requestDisclosureOpenChange(!root.open, this);
    });
  };

  syncDisclosureTreeAroundSelf() {
    const root = this.disclosureRoot();
    if (root instanceof DisclosureWebElement) {
      root.syncDisclosureTreeFromRoot();
    }
  }

  syncDisclosureTreeFromRoot() {
    if (this.disclosurePartName() !== "Root" || this.#disclosureSyncing || !this.isConnected) {
      return;
    }

    this.#disclosureSyncing = true;
    try {
      const root = this;
      if (!this.#disclosureDefaultOpenApplied) {
        this.#disclosureControlledOpen = root.hasAttribute("open");
        this.#disclosureDefaultOpenApplied = true;

        const defaultOpen = root.getAttribute("default-open") ?? root.getAttribute("defaultopen");
        if (!this.#disclosureControlledOpen && defaultOpen != null && !isFalseAttributeValue(defaultOpen)) {
          root.setAttribute("open", "");
        }
      }

      const isOpen = root.hasAttribute("open");
      const state = isOpen ? "open" : "closed";
      const content = this.disclosureContent(root);
      const contentHost = content ? this.syncDisclosureContent(content, isOpen, state) : null;
      const triggers = this.disclosureElements(root, "aria-disclosure-trigger");

      root.setAttribute("data-state", state);
      root.removeAttribute("aria-expanded");

      for (const trigger of triggers) {
        if (!trigger.hasAttribute("type")) {
          trigger.setAttribute("type", "button");
        }
        setBooleanAttribute(trigger, "open", isOpen);
        trigger.setAttribute("aria-expanded", String(isOpen));
        trigger.setAttribute("data-state", state);
        if (contentHost) {
          trigger.setAttribute("aria-controls", contentHost.id);
        } else {
          trigger.removeAttribute("aria-controls");
        }
      }
    } finally {
      this.#disclosureSyncing = false;
    }
  }

  syncDisclosureContent(content: HTMLElement, isOpen: boolean, state: string) {
    const host = disclosureContentHost(content);
    const forceMount = content.hasAttribute("force-mount") || host.hasAttribute("force-mount");
    const existingId = host === content ? content.id : host.id || content.id;

    if (!host.id) {
      host.id = existingId || "ariaui-disclosure-" + ++disclosureId + "-content";
    }

    syncDisclosureCompositionHost(content, host);

    if (!host.hasAttribute("role")) {
      host.setAttribute("role", "region");
    }

    setBooleanAttribute(host, "open", isOpen);
    host.setAttribute("aria-hidden", String(!isOpen));
    host.setAttribute("data-state", state);
    host.hidden = !isOpen && !forceMount;

    if (host !== content) {
      content.removeAttribute("id");
      content.removeAttribute("open");
      content.removeAttribute("role");
      content.removeAttribute("aria-hidden");
      content.setAttribute("data-state", state);
      content.hidden = false;
    }

    return host;
  }

  requestDisclosureOpenChange(open: boolean, source: Element) {
    const detail = { open, source };
    this.dispatchEvent(new CustomEvent("openchange", { bubbles: true, detail }));
    this.dispatchEvent(new CustomEvent("disclosure-open-change", { bubbles: true, detail }));

    if (this.#disclosureControlledOpen) {
      return true;
    }

    setBooleanAttribute(this, "open", open);
    this.syncDisclosureTreeFromRoot();
    return true;
  }
}

export function createDisclosureWebComponent(part: WebComponentPartSpec): typeof DisclosureWebElement {
  return class extends DisclosureWebElement {
    static override packageSlug = "disclosure";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
