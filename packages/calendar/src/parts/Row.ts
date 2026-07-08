import { createCalendarWebComponent } from "../calendar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Row");

if (!partSpec) {
  throw new Error("Missing Row part spec for @ariaui-web/calendar.");
}

export const Row = createCalendarWebComponent(partSpec);
export type RowElement = InstanceType<typeof Row>;
