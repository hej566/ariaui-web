import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class SpinbuttonWebElement extends AriaWebElement {}

export function createSpinbuttonWebComponent(part: WebComponentPartSpec): typeof SpinbuttonWebElement {
  return class extends SpinbuttonWebElement {
    static override packageSlug = "spinbutton";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
