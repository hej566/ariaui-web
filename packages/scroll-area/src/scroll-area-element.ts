import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class ScrollAreaWebElement extends AriaWebElement {}

export function createScrollAreaWebComponent(part: WebComponentPartSpec): typeof ScrollAreaWebElement {
  return class extends ScrollAreaWebElement {
    static override packageSlug = "scroll-area";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
