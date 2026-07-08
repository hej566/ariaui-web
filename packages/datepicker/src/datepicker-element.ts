import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class DatepickerWebElement extends AriaWebElement {}

export function createDatepickerWebComponent(part: WebComponentPartSpec): typeof DatepickerWebElement {
  return class extends DatepickerWebElement {
    static override packageSlug = "datepicker";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
