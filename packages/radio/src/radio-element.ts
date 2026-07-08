import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class RadioWebElement extends AriaWebElement {}

export function createRadioWebComponent(part: WebComponentPartSpec): typeof RadioWebElement {
  return class extends RadioWebElement {
    static override packageSlug = "radio";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
