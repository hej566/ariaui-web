import { createPopoverWebComponent } from "../popover-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Trigger");

if (!partSpec) {
  throw new Error("Missing Trigger part spec for @ariaui-web/popover.");
}

export const Trigger = createPopoverWebComponent(partSpec);
export type TriggerElement = InstanceType<typeof Trigger>;
