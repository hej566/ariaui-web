import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class TabsWebElement extends AriaWebElement {}

export function createTabsWebComponent(part: WebComponentPartSpec): typeof TabsWebElement {
  return class extends TabsWebElement {
    static override packageSlug = "tabs";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
