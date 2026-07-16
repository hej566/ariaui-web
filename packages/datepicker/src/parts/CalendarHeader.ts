import { createDatepickerWebComponent } from "../datepicker-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "CalendarHeader");

if (!partSpec) {
  throw new Error("Missing CalendarHeader part spec for @ariaui-web/datepicker.");
}

export const CalendarHeader = createDatepickerWebComponent(partSpec);
export type CalendarHeaderElement = InstanceType<typeof CalendarHeader>;
