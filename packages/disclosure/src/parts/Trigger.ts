import { createDisclosureWebComponent } from "../disclosure-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Trigger");

if (!partSpec) {
  throw new Error("Missing Trigger part spec for @ariaui-web/disclosure.");
}

export const Trigger = createDisclosureWebComponent(partSpec);
export type TriggerElement = InstanceType<typeof Trigger>;
