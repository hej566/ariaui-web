import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class ListboxWebElement extends AriaWebElement {
  override afterAriaWebContractApplied() {
    const constructor = this.constructor as typeof ListboxWebElement;
    const tabindex = constructor.defaultAttributes.tabindex;
    if (tabindex && this.getAttribute("tabindex") !== tabindex) {
      this.setAttribute("tabindex", tabindex);
    }
    const popup = constructor.defaultAttributes["aria-haspopup"];
    if (popup && this.getAttribute("aria-haspopup") !== popup) {
      this.setAttribute("aria-haspopup", popup);
    }
    const expanded = constructor.defaultAttributes["aria-expanded"];
    if (expanded && !this.hasAttribute("open") && this.getAttribute("aria-expanded") !== expanded) {
      this.setAttribute("aria-expanded", expanded);
    }
  }
}

export function createListboxWebComponent(part: WebComponentPartSpec): typeof ListboxWebElement {
  return class extends ListboxWebElement {
    static override packageSlug = "listbox";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
