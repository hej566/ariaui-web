import { createCommandWebComponent } from "../command-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Group");

if (!partSpec) {
  throw new Error("Missing Group part spec for @ariaui-web/command.");
}

export const Group = createCommandWebComponent(partSpec);
export type GroupElement = InstanceType<typeof Group>;
