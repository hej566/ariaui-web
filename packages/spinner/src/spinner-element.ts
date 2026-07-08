import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class SpinnerWebElement extends AriaWebElement {}

export function createSpinnerWebComponent(part: WebComponentPartSpec): typeof SpinnerWebElement {
  return class extends SpinnerWebElement {
    static override packageSlug = "spinner";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
