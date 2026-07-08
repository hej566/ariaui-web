import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class MenubarWebElement extends AriaWebElement {}

export function createMenubarWebComponent(part: WebComponentPartSpec): typeof MenubarWebElement {
  return class extends MenubarWebElement {
    static override packageSlug = "menubar";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
