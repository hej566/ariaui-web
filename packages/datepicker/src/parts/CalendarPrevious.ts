import { createDatepickerWebComponent } from "../datepicker-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "CalendarPrevious");

if (!partSpec) {
  throw new Error("Missing CalendarPrevious part spec for @ariaui-web/datepicker.");
}

export const CalendarPrevious = createDatepickerWebComponent(partSpec);
export type CalendarPreviousElement = InstanceType<typeof CalendarPrevious>;
