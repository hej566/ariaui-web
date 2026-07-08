import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class LabelWebElement extends AriaWebElement {}

export function createLabelWebComponent(part: WebComponentPartSpec): typeof LabelWebElement {
  return class extends LabelWebElement {
    static override packageSlug = "label";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
