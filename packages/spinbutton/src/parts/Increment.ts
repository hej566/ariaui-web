import { createSpinbuttonWebComponent } from "../spinbutton-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Increment");

if (!partSpec) {
  throw new Error("Missing Increment part spec for @ariaui-web/spinbutton.");
}

export const Increment = createSpinbuttonWebComponent(partSpec);
export type IncrementElement = InstanceType<typeof Increment>;
