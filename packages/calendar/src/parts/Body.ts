import { createCalendarWebComponent } from "../calendar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Body");

if (!partSpec) {
  throw new Error("Missing Body part spec for @ariaui-web/calendar.");
}

export const Body = createCalendarWebComponent(partSpec);
export type BodyElement = InstanceType<typeof Body>;
