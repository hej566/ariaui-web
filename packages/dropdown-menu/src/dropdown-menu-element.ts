import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class DropdownMenuWebElement extends AriaWebElement {}

export function createDropdownMenuWebComponent(part: WebComponentPartSpec): typeof DropdownMenuWebElement {
  return class extends DropdownMenuWebElement {
    static override packageSlug = "dropdown-menu";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
