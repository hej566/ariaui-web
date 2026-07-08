import { createHoverCardWebComponent } from "../hover-card-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Trigger");

if (!partSpec) {
  throw new Error("Missing Trigger part spec for @ariaui-web/hover-card.");
}

export const Trigger = createHoverCardWebComponent(partSpec);
export type TriggerElement = InstanceType<typeof Trigger>;
