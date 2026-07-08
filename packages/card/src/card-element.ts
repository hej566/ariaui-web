import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class CardWebElement extends AriaWebElement {}

export function createCardWebComponent(part: WebComponentPartSpec): typeof CardWebElement {
  return class extends CardWebElement {
    static override packageSlug = "card";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
