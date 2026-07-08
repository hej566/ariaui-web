import { createDrawerWebComponent } from "../drawer-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Trigger");

if (!partSpec) {
  throw new Error("Missing Trigger part spec for @ariaui-web/drawer.");
}

export const Trigger = createDrawerWebComponent(partSpec);
export type TriggerElement = InstanceType<typeof Trigger>;
