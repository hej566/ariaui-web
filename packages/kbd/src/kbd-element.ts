import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class KbdWebElement extends AriaWebElement {}

export function createKbdWebComponent(part: WebComponentPartSpec): typeof KbdWebElement {
  return class extends KbdWebElement {
    static override packageSlug = "kbd";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
