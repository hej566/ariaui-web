import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class TooltipWebElement extends AriaWebElement {}

export function createTooltipWebComponent(part: WebComponentPartSpec): typeof TooltipWebElement {
  return class extends TooltipWebElement {
    static override packageSlug = "tooltip";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
