import { createTreegridWebComponent } from "../treegrid-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Group");

if (!partSpec) {
  throw new Error("Missing Group part spec for @ariaui-web/treegrid.");
}

export const Group = createTreegridWebComponent(partSpec);
export type GroupElement = InstanceType<typeof Group>;
