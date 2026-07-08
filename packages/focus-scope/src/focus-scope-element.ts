import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class FocusScopeWebElement extends AriaWebElement {}

export function createFocusScopeWebComponent(part: WebComponentPartSpec): typeof FocusScopeWebElement {
  return class extends FocusScopeWebElement {
    static override packageSlug = "focus-scope";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
