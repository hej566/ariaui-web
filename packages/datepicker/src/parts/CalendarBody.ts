import { createDatepickerWebComponent } from "../datepicker-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "CalendarBody");

if (!partSpec) {
  throw new Error("Missing CalendarBody part spec for @ariaui-web/datepicker.");
}

export const CalendarBody = createDatepickerWebComponent(partSpec);
export type CalendarBodyElement = InstanceType<typeof CalendarBody>;
