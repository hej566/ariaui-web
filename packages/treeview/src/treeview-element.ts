import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class TreeviewWebElement extends AriaWebElement {}

export function createTreeviewWebComponent(part: WebComponentPartSpec): typeof TreeviewWebElement {
  return class extends TreeviewWebElement {
    static override packageSlug = "treeview";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
