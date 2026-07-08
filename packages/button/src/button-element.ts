import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class ButtonWebElement extends AriaWebElement {}

export function createButtonWebComponent(part: WebComponentPartSpec): typeof ButtonWebElement {
  return class extends ButtonWebElement {
    static override packageSlug = "button";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
