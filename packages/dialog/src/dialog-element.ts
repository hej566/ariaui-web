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

let dialogId = 0;

export class DialogWebElement extends AriaWebElement {
  #dialogControlledOpen = false;
  #dialogDefaultOpenApplied = false;
  #dialogEventsBound = false;
  #dialogLastTrigger: HTMLElement | null = null;
  #dialogObserver: MutationObserver | null = null;
  #dialogSyncing = false;

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "default-open", "defaultopen", "force-mount"]));
  }

  dialogPartName() {
    const constructor = this.constructor as typeof DialogWebElement;
    return constructor.partName;
  }

  dialogRoot() {
    return this.dialogPartName() === "Root" ? this : this.closest("aria-dialog");
  }

  dialogElements(root: Element, selector: string) {
    return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-dialog") === root);
  }

  dialogContent(root: Element) {
    return this.dialogElements(root, "aria-dialog-content")[0] ?? null;
  }

  dialogElementsInContent(content: Element, selector: string) {
    return Array.from(content.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-dialog-content") === content);
  }

  override afterAriaWebContractApplied() {
    this.bindDialogEvents();
    this.syncDialogTreeAroundSelf();
  }

  disconnectedCallback() {
    if (this.dialogPartName() === "Root") {
      this.#dialogObserver?.disconnect();
      this.#dialogObserver = null;
    }
  }

  bindDialogEvents() {
    if (this.#dialogEventsBound) {
      return;
    }

    const partName = this.dialogPartName();
    if (partName === "Root") {
      this.observeDialogTree();
    } else if (partName === "Trigger") {
      this.addEventListener("click", this.handleDialogTriggerClick);
    } else if (partName === "Action" || partName === "Cancel" || partName === "Close") {
      this.addEventListener("click", this.handleDialogCloseClick);
    } else if (partName === "Overlay") {
      this.addEventListener("click", this.handleDialogOverlayClick);
    } else if (partName === "Content") {
      this.addEventListener("keydown", this.handleDialogContentKeyDown);
    }

    this.#dialogEventsBound = true;
  }

  observeDialogTree() {
    if (this.#dialogObserver || typeof MutationObserver === "undefined") {
      return;
    }

    this.#dialogObserver = new MutationObserver(() => {
      if (!this.#dialogSyncing) {
        this.syncDialogTreeFromRoot();
      }
    });
    this.#dialogObserver.observe(this, { childList: true, subtree: true });
  }

  handleDialogTriggerClick = (event: MouseEvent) => {
    const root = this.dialogRoot();
    if (!(root instanceof DialogWebElement)) {
      return;
    }

    queueMicrotask(() => {
      if (event.defaultPrevented || this.disabled) {
        return;
      }

      if (root.open) {
        root.requestDialogClose(this);
      } else {
        root.requestDialogOpen(this);
      }
    });
  };

  handleDialogCloseClick = (event: MouseEvent) => {
    const root = this.dialogRoot();
    if (!(root instanceof DialogWebElement)) {
      return;
    }

    queueMicrotask(() => {
      if (!event.defaultPrevented) {
        root.requestDialogClose(this);
      }
    });
  };

  handleDialogOverlayClick = (event: MouseEvent) => {
    if (event.target !== this) {
      return;
    }

    const root = this.dialogRoot();
    if (!(root instanceof DialogWebElement)) {
      return;
    }

    queueMicrotask(() => {
      if (!event.defaultPrevented) {
        root.requestDialogClose(this);
      }
    });
  };

  handleDialogContentKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab" && this.getAttribute("role") === "dialog") {
      this.trapDialogFocus(event);
      return;
    }

    if (event.key !== "Escape") {
      return;
    }

    const root = this.dialogRoot();
    if (!(root instanceof DialogWebElement)) {
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
      root.requestDialogClose(this);
    });
  };

  trapDialogFocus(event: KeyboardEvent) {
    const focusableElements = this.dialogFocusableElements(this);
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

  dialogFocusableElements(container: Element) {
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        "aria-dialog-cancel, aria-dialog-action, aria-dialog-close, button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      ),
    ).filter((element) => {
      return !element.hidden && !element.hasAttribute("disabled") && (!(element as HTMLButtonElement).disabled);
    });
  }

  syncDialogTreeAroundSelf() {
    const root = this.dialogRoot();
    if (root instanceof DialogWebElement) {
      root.syncDialogTreeFromRoot();
    }
  }

  syncDialogTreeFromRoot() {
    if (this.dialogPartName() !== "Root" || this.#dialogSyncing || !this.isConnected) {
      return;
    }

    this.#dialogSyncing = true;
    try {
      const root = this;
      let shouldFocusDefaultOpen = false;
      if (!this.#dialogDefaultOpenApplied) {
        this.#dialogControlledOpen = root.hasAttribute("open");
        this.#dialogDefaultOpenApplied = true;

        const defaultOpen = root.getAttribute("default-open") ?? root.getAttribute("defaultopen");
        if (!this.#dialogControlledOpen && defaultOpen != null && !isFalseAttributeValue(defaultOpen)) {
          root.setAttribute("open", "");
          shouldFocusDefaultOpen = true;
        }
      }

      if (!root.id) {
        root.id = "ariaui-dialog-" + ++dialogId + "-root";
      }

      const isOpen = root.hasAttribute("open");
      const state = isOpen ? "open" : "closed";
      root.setAttribute("data-state", state);
      root.removeAttribute("aria-expanded");

      const content = this.dialogContent(root);
      const triggers = this.dialogElements(root, "aria-dialog-trigger");
      const overlays = this.dialogElements(root, "aria-dialog-overlay");
      const portals = this.dialogElements(root, "aria-dialog-portal");
      const actions = this.dialogElements(root, "aria-dialog-action");
      const cancels = this.dialogElements(root, "aria-dialog-cancel");
      const closes = this.dialogElements(root, "aria-dialog-close");

      if (content && !content.id) {
        content.id = "ariaui-dialog-" + ++dialogId + "-content";
      }

      for (const trigger of triggers) {
        setBooleanAttribute(trigger, "open", isOpen);
        trigger.setAttribute("aria-expanded", String(isOpen));
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("data-state", state);
        if (content && isOpen) {
          trigger.setAttribute("aria-controls", content.id);
        } else {
          trigger.removeAttribute("aria-controls");
        }
      }

      for (const action of actions) {
        action.setAttribute("data-dialog-action", "");
        if (!action.hasAttribute("type")) {
          action.setAttribute("type", "button");
        }
      }

      for (const cancel of cancels) {
        cancel.setAttribute("data-dialog-cancel", "");
        if (!cancel.hasAttribute("type")) {
          cancel.setAttribute("type", "button");
        }
      }

      for (const close of closes) {
        if (!close.hasAttribute("type")) {
          close.setAttribute("type", "button");
        }
      }

      if (content) {
        this.syncDialogContent(content, isOpen, state);
      }

      for (const overlay of overlays) {
        overlay.setAttribute("data-state", state);
        overlay.hidden = !isOpen && !overlay.hasAttribute("force-mount");
      }

      for (const portal of portals) {
        portal.setAttribute("data-state", state);
        portal.hidden = !isOpen && !portal.hasAttribute("force-mount");
      }

      if (shouldFocusDefaultOpen) {
        queueMicrotask(() => {
          if (this.isConnected && this.hasAttribute("open")) {
            this.focusInitialDialogTarget();
          }
        });
      }
    } finally {
      this.#dialogSyncing = false;
    }
  }

  syncDialogContent(content: HTMLElement, isOpen: boolean, state: string) {
    content.removeAttribute("open");
    content.setAttribute("data-dialog-content", "");

    const titles = this.dialogElementsInContent(content, "aria-dialog-title");
    const descriptions = this.dialogElementsInContent(content, "aria-dialog-description");

    for (const title of titles) {
      if (!title.id) {
        title.id = "ariaui-dialog-" + ++dialogId + "-title";
      }
      if (title.getAttribute("role") === "heading" && !title.hasAttribute("aria-level")) {
        title.setAttribute("aria-level", "2");
      }
    }

    for (const description of descriptions) {
      if (!description.id) {
        description.id = "ariaui-dialog-" + ++dialogId + "-description";
      }
    }

    if (isOpen) {
      content.setAttribute("role", "dialog");
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

    content.hidden = !isOpen && !content.hasAttribute("force-mount");
    content.setAttribute("data-state", state);
  }

  requestDialogOpen(source: Element) {
    this.#dialogLastTrigger = source instanceof HTMLElement ? source : null;
    this.dispatchDialogOpenChange(true, source);

    if (this.#dialogControlledOpen) {
      return true;
    }

    setBooleanAttribute(this, "open", true);
    this.syncDialogTreeFromRoot();
    this.focusInitialDialogTarget();
    return true;
  }

  requestDialogClose(source: Element = this) {
    const content = this.dialogContent(this);
    this.dispatchDialogOpenChange(false, source);

    if (this.#dialogControlledOpen) {
      return true;
    }

    setBooleanAttribute(this, "open", false);
    this.syncDialogTreeFromRoot();
    this.restoreDialogFocus(content);
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, detail: { source } }));
    return true;
  }

  dispatchDialogOpenChange(open: boolean, source: Element) {
    const detail = { open, source };
    this.dispatchEvent(new CustomEvent("openchange", { bubbles: true, detail }));
    this.dispatchEvent(new CustomEvent("dialog-open-change", { bubbles: true, detail }));
  }

  focusInitialDialogTarget() {
    const content = this.dialogContent(this);
    if (!content) {
      return;
    }

    const event = new CustomEvent("openautofocus", { bubbles: true, cancelable: true });
    content.dispatchEvent(event);
    if (event.defaultPrevented) {
      return;
    }

    const target = this.dialogElementsInContent(content, "aria-dialog-cancel")[0]
      ?? this.dialogFocusableElements(content)[0]
      ?? content;
    target.focus({ preventScroll: true });
  }

  restoreDialogFocus(content: HTMLElement | null) {
    if (content) {
      const event = new CustomEvent("closeautofocus", { bubbles: true, cancelable: true });
      content.dispatchEvent(event);
      if (event.defaultPrevented) {
        return;
      }
    }

    const trigger = this.#dialogLastTrigger ?? this.dialogElements(this, "aria-dialog-trigger")[0] ?? null;
    if (canRestoreFocusTo(trigger)) {
      trigger.focus({ preventScroll: true });
      return;
    }

    if (!document.body.hasAttribute("tabindex")) {
      document.body.setAttribute("tabindex", "-1");
    }
    document.body.focus({ preventScroll: true });
  }
}

export function createDialogWebComponent(part: WebComponentPartSpec): typeof DialogWebElement {
  return class extends DialogWebElement {
    static override packageSlug = "dialog";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
