import { createCommandWebComponent } from "../command-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Input");

if (!partSpec) {
  throw new Error("Missing Input part spec for @ariaui-web/command.");
}

export const Input = createCommandWebComponent(partSpec);
export type InputElement = InstanceType<typeof Input>;
