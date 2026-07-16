import { createDatepickerWebComponent } from "../datepicker-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "CalendarNext");

if (!partSpec) {
  throw new Error("Missing CalendarNext part spec for @ariaui-web/datepicker.");
}

export const CalendarNext = createDatepickerWebComponent(partSpec);
export type CalendarNextElement = InstanceType<typeof CalendarNext>;
