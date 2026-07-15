import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { popoverRoot, type PopoverRootElement } from "./popover-dom";
import { cleanupPopoverRoot, syncPopoverTreeAround, syncPopoverTreeFromRoot } from "./popover-sync";

const rootObservers = new WeakMap<HTMLElement, MutationObserver>();

export class PopoverWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "arrow",
      "arrow-class",
      "default-open",
      "loop",
      "modal",
      "native-composition",
      "offset",
      "placement",
    ]));
  }

  override get open() {
    return this.hasAttribute("open");
  }

  override set open(value: boolean) {
    this.toggleAttribute("open", Boolean(value));
    syncPopoverTreeAround(this);
  }

  syncPopoverTreeFromRoot = () => {
    const root = popoverRoot(this);
    if (root instanceof HTMLElement) syncPopoverTreeFromRoot(root as PopoverRootElement);
  };

  override connectedCallback() {
    super.connectedCallback();
    const constructor = this.constructor as typeof PopoverWebElement;
    if (constructor.partName !== "Root" || rootObservers.has(this)) return;
    const observer = new MutationObserver(() => syncPopoverTreeFromRoot(this as PopoverRootElement));
    observer.observe(this, {
      attributes: true,
      attributeFilter: ["id", "native-composition"],
      childList: true,
      subtree: true,
    });
    rootObservers.set(this, observer);
  }

  disconnectedCallback() {
    const constructor = this.constructor as typeof PopoverWebElement;
    if (constructor.partName !== "Root") return;
    rootObservers.get(this)?.disconnect();
    rootObservers.delete(this);
    cleanupPopoverRoot(this);
  }

  override afterAriaWebContractApplied() {
    syncPopoverTreeAround(this);
  }
}

export function createPopoverWebComponent(part: WebComponentPartSpec): typeof PopoverWebElement {
  return class extends PopoverWebElement {
    static override packageSlug = "popover";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
