import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class SwitchWebElement extends AriaWebElement {}

export function createSwitchWebComponent(part: WebComponentPartSpec): typeof SwitchWebElement {
  return class extends SwitchWebElement {
    static override packageSlug = "switch";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
