import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class DisclosureWebElement extends AriaWebElement {}

export function createDisclosureWebComponent(part: WebComponentPartSpec): typeof DisclosureWebElement {
  return class extends DisclosureWebElement {
    static override packageSlug = "disclosure";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
