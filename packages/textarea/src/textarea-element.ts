import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class TextareaWebElement extends AriaWebElement {}

export function createTextareaWebComponent(part: WebComponentPartSpec): typeof TextareaWebElement {
  return class extends TextareaWebElement {
    static override packageSlug = "textarea";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
