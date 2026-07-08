import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class PortalWebElement extends AriaWebElement {}

export function createPortalWebComponent(part: WebComponentPartSpec): typeof PortalWebElement {
  return class extends PortalWebElement {
    static override packageSlug = "portal";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
