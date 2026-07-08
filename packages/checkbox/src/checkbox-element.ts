import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class CheckboxWebElement extends AriaWebElement {}

export function createCheckboxWebComponent(part: WebComponentPartSpec): typeof CheckboxWebElement {
  return class extends CheckboxWebElement {
    static override packageSlug = "checkbox";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
