import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import {
  disconnectScrollAreaRoot,
  disconnectScrollAreaViewport,
  observeScrollAreaRoot,
  observeScrollAreaViewport,
  requestScrollAreaButtonScroll,
  syncScrollAreaElement,
} from "./scroll-area-sync";

export class ScrollAreaWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "anchor-selected",
      "aria-activedescendant",
      "aria-label",
      "behavior",
      "class",
      "max-visible-items",
      "native-composition",
      "role",
      "style",
    ]));
  }

  get anchorSelected() { return this.hasAttribute("anchor-selected"); }
  set anchorSelected(value: boolean) { this.toggleAttribute("anchor-selected", value); }
  get behavior() { return (this.getAttribute("behavior") ?? "smooth") as ScrollBehavior; }
  set behavior(value: ScrollBehavior) { this.setAttribute("behavior", value); }
  get maxVisibleItems() { return Number(this.getAttribute("max-visible-items")); }
  set maxVisibleItems(value: number) { this.setAttribute("max-visible-items", String(value)); }
  get orientation() { return this.getAttribute("orientation") ?? "vertical"; }
  set orientation(value: string) { this.setAttribute("orientation", value); }
  get type() { return this.getAttribute("type") ?? "hover"; }
  set type(value: string) { this.setAttribute("type", value); }

  scrollAreaPartName() {
    return (this.constructor as typeof ScrollAreaWebElement).partName;
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.scrollAreaPartName() === "Root") observeScrollAreaRoot(this);
    if (this.scrollAreaPartName() === "Viewport") observeScrollAreaViewport(this);
    syncScrollAreaElement(this);
  }

  disconnectedCallback() {
    if (this.scrollAreaPartName() === "Root") disconnectScrollAreaRoot(this);
    if (this.scrollAreaPartName() === "Viewport") disconnectScrollAreaViewport(this);
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncScrollAreaElement(this);
  }

  override handleAriaWebClick = (event: Event) => {
    const part = this.scrollAreaPartName();
    if (part === "ScrollUpButton" || part === "ScrollDownButton") {
      if (this.hasAttribute("disabled")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      requestScrollAreaButtonScroll(this, event);
    }
  };
}

export function createScrollAreaWebComponent(part: WebComponentPartSpec): typeof ScrollAreaWebElement {
  return class extends ScrollAreaWebElement {
    static override packageSlug = "scroll-area";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
