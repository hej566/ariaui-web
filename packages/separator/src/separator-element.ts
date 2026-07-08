import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class SeparatorWebElement extends AriaWebElement {}

export function createSeparatorWebComponent(part: WebComponentPartSpec): typeof SeparatorWebElement {
  return class extends SeparatorWebElement {
    static override packageSlug = "separator";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
