import { createCommandWebComponent } from "../command-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Label");

if (!partSpec) {
  throw new Error("Missing Label part spec for @ariaui-web/command.");
}

export const Label = createCommandWebComponent(partSpec);
export type LabelElement = InstanceType<typeof Label>;
