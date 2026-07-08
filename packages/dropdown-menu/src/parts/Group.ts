import { createDropdownMenuWebComponent } from "../dropdown-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Group");

if (!partSpec) {
  throw new Error("Missing Group part spec for @ariaui-web/dropdown-menu.");
}

export const Group = createDropdownMenuWebComponent(partSpec);
export type GroupElement = InstanceType<typeof Group>;
