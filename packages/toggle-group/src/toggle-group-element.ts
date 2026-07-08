import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class ToggleGroupWebElement extends AriaWebElement {}

export function createToggleGroupWebComponent(part: WebComponentPartSpec): typeof ToggleGroupWebElement {
  return class extends ToggleGroupWebElement {
    static override packageSlug = "toggle-group";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
