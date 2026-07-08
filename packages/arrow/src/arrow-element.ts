import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class ArrowWebElement extends AriaWebElement {}

export function createArrowWebComponent(part: WebComponentPartSpec): typeof ArrowWebElement {
  return class extends ArrowWebElement {
    static override packageSlug = "arrow";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
