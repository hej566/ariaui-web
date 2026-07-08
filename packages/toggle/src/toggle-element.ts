import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class ToggleWebElement extends AriaWebElement {}

export function createToggleWebComponent(part: WebComponentPartSpec): typeof ToggleWebElement {
  return class extends ToggleWebElement {
    static override packageSlug = "toggle";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
