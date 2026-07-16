import { createDatepickerWebComponent } from "../datepicker-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "CalendarMonth");

if (!partSpec) {
  throw new Error("Missing CalendarMonth part spec for @ariaui-web/datepicker.");
}

export const CalendarMonth = createDatepickerWebComponent(partSpec);
export type CalendarMonthElement = InstanceType<typeof CalendarMonth>;
