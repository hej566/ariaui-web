import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class TreegridWebElement extends AriaWebElement {}

export function createTreegridWebComponent(part: WebComponentPartSpec): typeof TreegridWebElement {
  return class extends TreegridWebElement {
    static override packageSlug = "treegrid";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
