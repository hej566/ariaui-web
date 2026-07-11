import { CalendarElement } from "../calendar-element";
import { getCalendarPartSpec } from "./part-spec";

const partSpec = getCalendarPartSpec("MonthSelect");

export class MonthSelect extends CalendarElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type MonthSelectElement = InstanceType<typeof MonthSelect>;
