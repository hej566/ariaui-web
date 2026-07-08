import { createSpinbuttonWebComponent } from "../spinbutton-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Input");

if (!partSpec) {
  throw new Error("Missing Input part spec for @ariaui-web/spinbutton.");
}

export const Input = createSpinbuttonWebComponent(partSpec);
export type InputElement = InstanceType<typeof Input>;
