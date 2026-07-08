import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class HoverCardWebElement extends AriaWebElement {}

export function createHoverCardWebComponent(part: WebComponentPartSpec): typeof HoverCardWebElement {
  return class extends HoverCardWebElement {
    static override packageSlug = "hover-card";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
