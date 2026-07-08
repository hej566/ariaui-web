import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class DrawerWebElement extends AriaWebElement {}

export function createDrawerWebComponent(part: WebComponentPartSpec): typeof DrawerWebElement {
  return class extends DrawerWebElement {
    static override packageSlug = "drawer";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
