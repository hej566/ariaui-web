import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class PopoverWebElement extends AriaWebElement {}

export function createPopoverWebComponent(part: WebComponentPartSpec): typeof PopoverWebElement {
  return class extends PopoverWebElement {
    static override packageSlug = "popover";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
