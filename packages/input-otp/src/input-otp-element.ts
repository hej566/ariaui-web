import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class InputOtpWebElement extends AriaWebElement {}

export function createInputOtpWebComponent(part: WebComponentPartSpec): typeof InputOtpWebElement {
  return class extends InputOtpWebElement {
    static override packageSlug = "input-otp";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
