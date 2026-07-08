import { createDatepickerWebComponent } from "../datepicker-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Calendar");

if (!partSpec) {
  throw new Error("Missing Calendar part spec for @ariaui-web/datepicker.");
}

export const Calendar = createDatepickerWebComponent(partSpec);
export type CalendarElement = InstanceType<typeof Calendar>;
