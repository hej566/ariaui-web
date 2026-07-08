import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class SlotWebElement extends AriaWebElement {}

export function createSlotWebComponent(part: WebComponentPartSpec): typeof SlotWebElement {
  return class extends SlotWebElement {
    static override packageSlug = "slot";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
