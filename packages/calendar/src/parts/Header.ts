import { createCalendarWebComponent } from "../calendar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Header");

if (!partSpec) {
  throw new Error("Missing Header part spec for @ariaui-web/calendar.");
}

export const Header = createCalendarWebComponent(partSpec);
export type HeaderElement = InstanceType<typeof Header>;
