import { createSelectWebComponent } from "../select-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Group");

if (!partSpec) {
  throw new Error("Missing Group part spec for @ariaui-web/select.");
}

export const Group = createSelectWebComponent(partSpec);
export type GroupElement = InstanceType<typeof Group>;
