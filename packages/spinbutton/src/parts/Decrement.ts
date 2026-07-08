import { createSpinbuttonWebComponent } from "../spinbutton-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Decrement");

if (!partSpec) {
  throw new Error("Missing Decrement part spec for @ariaui-web/spinbutton.");
}

export const Decrement = createSpinbuttonWebComponent(partSpec);
export type DecrementElement = InstanceType<typeof Decrement>;
