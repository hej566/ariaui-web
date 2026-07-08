import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class ContextMenuWebElement extends AriaWebElement {}

export function createContextMenuWebComponent(part: WebComponentPartSpec): typeof ContextMenuWebElement {
  return class extends ContextMenuWebElement {
    static override packageSlug = "context-menu";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
