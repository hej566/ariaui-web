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

let alertId = 0;

export class AlertWebElement extends AriaWebElement {
  #alertDismissBound = false;
  #alertDefaultOpenApplied = false;
  #alertSyncing = false;
  #alertControlledOpen = false;

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "default-open", "defaultopen", "dismissible", "native-composition"]));
  }

  alertPartName() {
    const constructor = this.constructor as typeof AlertWebElement;
    return constructor.partName;
  }

  alertRoot() {
    return this.closest("aria-alert");
  }

  alertElements(root: Element, selector: string) {
    return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-alert") === root);
  }

  alertCompositionHost(part: HTMLElement) {
    if (!part.hasAttribute("native-composition")) {
      return part;
    }

    const child = Array.from(part.children).find((element): element is HTMLElement => element instanceof HTMLElement);
    return child ?? part;
  }

  syncAlertCompositionHost(part: HTMLElement) {
    const host = this.alertCompositionHost(part);
    if (host === part) {
      return host;
    }

    const className = part.getAttribute("class");
    if (className) {
      for (const token of className.split(/\s+/)) {
        if (token) {
          host.classList.add(token);
        }
      }
    }

    const style = part.getAttribute("style");
    if (style && !host.getAttribute("style")) {
      host.setAttribute("style", style);
    }

    for (const attribute of Array.from(part.attributes)) {
      const name = attribute.name;
      if (name === "class" || name === "style" || name === "native-composition") {
        continue;
      }

      if (name.startsWith("aria-") || name.startsWith("data-") || ["id", "part", "role", "tabindex", "title", "type", "value", "name", "disabled"].includes(name)) {
        host.setAttribute(name, attribute.value);
      }
    }

    host.removeAttribute("native-composition");
    return host;
  }

  override afterAriaWebContractApplied() {
    this.bindAlertDismissEvents();
    this.syncAlertTreeAroundSelf();
  }

  bindAlertDismissEvents() {
    const partName = this.alertPartName();
    if (this.#alertDismissBound || (partName !== "Close" && partName !== "Cancel")) {
      return;
    }

    this.addEventListener("click", this.handleAlertDismissClick);
    this.#alertDismissBound = true;
  }

  handleAlertDismissClick = (event: MouseEvent) => {
    const root = this.alertRoot();
    if (!(root instanceof AlertWebElement)) {
      return;
    }

    queueMicrotask(() => {
      if (!event.defaultPrevented) {
        root.requestAlertDismiss(this);
      }
    });
  };

  syncAlertTreeAroundSelf() {
    const root = this.alertPartName() === "Root" ? this : this.alertRoot();
    if (root instanceof AlertWebElement) {
      root.syncAlertTreeFromRoot();
    }
  }

  syncAlertTreeFromRoot() {
    if (this.alertPartName() !== "Root" || this.#alertSyncing) {
      return;
    }

    if (!this.isConnected) {
      return;
    }

    this.#alertSyncing = true;
    try {
      const root = this;
      if (!this.#alertDefaultOpenApplied) {
        this.#alertControlledOpen = root.hasAttribute("open");
        this.#alertDefaultOpenApplied = true;

        if (!this.#alertControlledOpen && !isFalseAttributeValue(root.getAttribute("default-open")) && !isFalseAttributeValue(root.getAttribute("defaultopen"))) {
          root.setAttribute("open", "");
        }
      }

      const titlePart = this.alertElements(root, "aria-alert-title")[0];
      const descriptionPart = this.alertElements(root, "aria-alert-description")[0];
      const title = titlePart ? this.syncAlertCompositionHost(titlePart) : null;
      const description = descriptionPart ? this.syncAlertCompositionHost(descriptionPart) : null;

      if (title) {
        if (!title.id) {
          title.id = "ariaui-alert-" + ++alertId + "-title";
        }
        if (title.getAttribute("role") === "heading" && !title.hasAttribute("aria-level")) {
          title.setAttribute("aria-level", "5");
        }
        root.setAttribute("aria-labelledby", title.id);
      } else {
        root.removeAttribute("aria-labelledby");
      }

      if (description) {
        if (!description.id) {
          description.id = "ariaui-alert-" + ++alertId + "-description";
        }
        root.setAttribute("aria-describedby", description.id);
      } else {
        root.removeAttribute("aria-describedby");
      }

      for (const action of this.alertElements(root, "aria-alert-action")) {
        const actionHost = this.syncAlertCompositionHost(action);
        action.setAttribute("data-alert-action", "");
        actionHost.setAttribute("data-alert-action", "");
      }

      for (const close of this.alertElements(root, "aria-alert-close")) {
        const closeHost = this.syncAlertCompositionHost(close);
        close.setAttribute("data-alert-close", "");
        closeHost.setAttribute("data-alert-close", "");
      }

      for (const cancel of this.alertElements(root, "aria-alert-cancel")) {
        const cancelHost = this.syncAlertCompositionHost(cancel);
        cancel.setAttribute("data-alert-cancel", "");
        cancelHost.setAttribute("data-alert-cancel", "");
      }

      const isOpen = root.hasAttribute("open");
      root.hidden = !isOpen;
      root.setAttribute("aria-hidden", String(!isOpen));
      root.setAttribute("data-state", isOpen ? "open" : "closed");
      if (root.hasAttribute("dismissible")) {
        root.setAttribute("data-dismissible", "");
      } else {
        root.removeAttribute("data-dismissible");
      }

      const rootHost = this.syncAlertCompositionHost(root);
      if (rootHost !== root) {
        rootHost.hidden = !isOpen;
        rootHost.setAttribute("aria-hidden", String(!isOpen));
        rootHost.setAttribute("data-state", isOpen ? "open" : "closed");
        if (root.hasAttribute("dismissible")) {
          rootHost.setAttribute("data-dismissible", "");
        } else {
          rootHost.removeAttribute("data-dismissible");
        }
      }
    } finally {
      this.#alertSyncing = false;
    }
  }

  requestAlertDismiss(source: Element) {
    if (!this.hasAttribute("dismissible")) {
      return false;
    }

    this.dispatchEvent(new CustomEvent("openchange", {
      bubbles: true,
      detail: {
        open: false,
        source,
      },
    }));

    if (this.#alertControlledOpen) {
      return true;
    }

    setBooleanAttribute(this, "open", false);
    this.syncAlertTreeFromRoot();
    return true;
  }
}

export function createAlertWebComponent(part: WebComponentPartSpec): typeof AlertWebElement {
  return class extends AlertWebElement {
    static override packageSlug = "alert";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
