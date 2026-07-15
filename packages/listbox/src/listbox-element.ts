import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class ListboxWebElement extends AriaWebElement {}

export function createListboxWebComponent(part: WebComponentPartSpec): typeof ListboxWebElement {
  return class extends ListboxWebElement {
    static override packageSlug = "listbox";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
