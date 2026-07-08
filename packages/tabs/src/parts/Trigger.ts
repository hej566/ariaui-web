import { createTabsWebComponent } from "../tabs-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Trigger");

if (!partSpec) {
  throw new Error("Missing Trigger part spec for @ariaui-web/tabs.");
}

export const Trigger = createTabsWebComponent(partSpec);
export type TriggerElement = InstanceType<typeof Trigger>;
