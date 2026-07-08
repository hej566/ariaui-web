import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class CalendarWebElement extends AriaWebElement {}

export function createCalendarWebComponent(part: WebComponentPartSpec): typeof CalendarWebElement {
  return class extends CalendarWebElement {
    static override packageSlug = "calendar";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
