import { CalendarElement } from "../calendar-element";
import { getCalendarPartSpec } from "./part-spec";

const partSpec = getCalendarPartSpec("HeaderNext");

export class HeaderNext extends CalendarElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type HeaderNextElement = InstanceType<typeof HeaderNext>;
