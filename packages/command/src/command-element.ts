import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class CommandWebElement extends AriaWebElement {}

export function createCommandWebComponent(part: WebComponentPartSpec): typeof CommandWebElement {
  return class extends CommandWebElement {
    static override packageSlug = "command";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
