import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class GridWebElement extends AriaWebElement {}

export function createGridWebComponent(part: WebComponentPartSpec): typeof GridWebElement {
  return class extends GridWebElement {
    static override packageSlug = "grid";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
