import { createDatepickerWebComponent } from "../datepicker-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "CalendarMonthSelect");

if (!partSpec) {
  throw new Error("Missing CalendarMonthSelect part spec for @ariaui-web/datepicker.");
}

export const CalendarMonthSelect = createDatepickerWebComponent(partSpec);
export type CalendarMonthSelectElement = InstanceType<typeof CalendarMonthSelect>;
