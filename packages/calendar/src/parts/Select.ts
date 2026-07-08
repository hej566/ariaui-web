import { createCalendarWebComponent } from "../calendar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Select");

if (!partSpec) {
  throw new Error("Missing Select part spec for @ariaui-web/calendar.");
}

export const Select = createCalendarWebComponent(partSpec);
export type SelectElement = InstanceType<typeof Select>;
