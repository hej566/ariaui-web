import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class ComboboxWebElement extends AriaWebElement {}

export function createComboboxWebComponent(part: WebComponentPartSpec): typeof ComboboxWebElement {
  return class extends ComboboxWebElement {
    static override packageSlug = "combobox";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
