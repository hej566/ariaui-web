import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class SidebarWebElement extends AriaWebElement {}

export function createSidebarWebComponent(part: WebComponentPartSpec): typeof SidebarWebElement {
  return class extends SidebarWebElement {
    static override packageSlug = "sidebar";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
