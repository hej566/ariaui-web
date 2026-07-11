import { CalendarElement } from "../calendar-element";
import { getCalendarPartSpec } from "./part-spec";

const partSpec = getCalendarPartSpec("Header");

export class Header extends CalendarElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type HeaderElement = InstanceType<typeof Header>;
