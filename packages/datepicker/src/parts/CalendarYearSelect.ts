import { createDatepickerWebComponent } from "../datepicker-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "CalendarYearSelect");

if (!partSpec) {
  throw new Error("Missing CalendarYearSelect part spec for @ariaui-web/datepicker.");
}

export const CalendarYearSelect = createDatepickerWebComponent(partSpec);
export type CalendarYearSelectElement = InstanceType<typeof CalendarYearSelect>;
