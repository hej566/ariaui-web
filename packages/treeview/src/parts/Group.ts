import { createTreeviewWebComponent } from "../treeview-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Group");

if (!partSpec) {
  throw new Error("Missing Group part spec for @ariaui-web/treeview.");
}

export const Group = createTreeviewWebComponent(partSpec);
export type GroupElement = InstanceType<typeof Group>;
