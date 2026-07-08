import { createMenubarWebComponent } from "../menubar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Trigger");

if (!partSpec) {
  throw new Error("Missing Trigger part spec for @ariaui-web/menubar.");
}

export const Trigger = createMenubarWebComponent(partSpec);
export type TriggerElement = InstanceType<typeof Trigger>;
