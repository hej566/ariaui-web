import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class InputWebElement extends AriaWebElement {}

export function createInputWebComponent(part: WebComponentPartSpec): typeof InputWebElement {
  return class extends InputWebElement {
    static override packageSlug = "input";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
