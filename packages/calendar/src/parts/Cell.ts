import { createCalendarWebComponent } from "../calendar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Cell");

if (!partSpec) {
  throw new Error("Missing Cell part spec for @ariaui-web/calendar.");
}

export const Cell = createCalendarWebComponent(partSpec);
export type CellElement = InstanceType<typeof Cell>;
