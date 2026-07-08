import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class NavigationMenuWebElement extends AriaWebElement {}

export function createNavigationMenuWebComponent(part: WebComponentPartSpec): typeof NavigationMenuWebElement {
  return class extends NavigationMenuWebElement {
    static override packageSlug = "navigation-menu";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
