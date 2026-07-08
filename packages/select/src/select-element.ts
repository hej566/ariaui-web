import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class SelectWebElement extends AriaWebElement {}

export function createSelectWebComponent(part: WebComponentPartSpec): typeof SelectWebElement {
  return class extends SelectWebElement {
    static override packageSlug = "select";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
