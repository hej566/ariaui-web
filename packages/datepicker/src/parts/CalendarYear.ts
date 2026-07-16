import { createDatepickerWebComponent } from "../datepicker-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "CalendarYear");

if (!partSpec) {
  throw new Error("Missing CalendarYear part spec for @ariaui-web/datepicker.");
}

export const CalendarYear = createDatepickerWebComponent(partSpec);
export type CalendarYearElement = InstanceType<typeof CalendarYear>;
