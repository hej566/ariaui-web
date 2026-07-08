import { createCommandWebComponent } from "../command-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Empty");

if (!partSpec) {
  throw new Error("Missing Empty part spec for @ariaui-web/command.");
}

export const Empty = createCommandWebComponent(partSpec);
export type EmptyElement = InstanceType<typeof Empty>;
