import { createTooltipWebComponent } from "../tooltip-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Trigger");

if (!partSpec) {
  throw new Error("Missing Trigger part spec for @ariaui-web/tooltip.");
}

export const Trigger = createTooltipWebComponent(partSpec);
export type TriggerElement = InstanceType<typeof Trigger>;
