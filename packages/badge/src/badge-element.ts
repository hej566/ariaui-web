import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class BadgeWebElement extends AriaWebElement {}

export function createBadgeWebComponent(part: WebComponentPartSpec): typeof BadgeWebElement {
  return class extends BadgeWebElement {
    static override packageSlug = "badge";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
