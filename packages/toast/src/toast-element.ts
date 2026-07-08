import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class ToastWebElement extends AriaWebElement {}

export function createToastWebComponent(part: WebComponentPartSpec): typeof ToastWebElement {
  return class extends ToastWebElement {
    static override packageSlug = "toast";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
