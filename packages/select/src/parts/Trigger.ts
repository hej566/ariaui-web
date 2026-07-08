import { createSelectWebComponent } from "../select-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Trigger");

if (!partSpec) {
  throw new Error("Missing Trigger part spec for @ariaui-web/select.");
}

export const Trigger = createSelectWebComponent(partSpec);
export type TriggerElement = InstanceType<typeof Trigger>;
