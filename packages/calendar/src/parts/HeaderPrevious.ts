import { CalendarElement } from "../calendar-element";
import { getCalendarPartSpec } from "./part-spec";

const partSpec = getCalendarPartSpec("HeaderPrevious");

export class HeaderPrevious extends CalendarElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type HeaderPreviousElement = InstanceType<typeof HeaderPrevious>;
