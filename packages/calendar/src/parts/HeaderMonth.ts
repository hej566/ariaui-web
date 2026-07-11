import { CalendarElement } from "../calendar-element";
import { getCalendarPartSpec } from "./part-spec";

const partSpec = getCalendarPartSpec("HeaderMonth");

export class HeaderMonth extends CalendarElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type HeaderMonthElement = InstanceType<typeof HeaderMonth>;
