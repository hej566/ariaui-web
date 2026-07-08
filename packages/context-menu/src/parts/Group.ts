import { createContextMenuWebComponent } from "../context-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Group");

if (!partSpec) {
  throw new Error("Missing Group part spec for @ariaui-web/context-menu.");
}

export const Group = createContextMenuWebComponent(partSpec);
export type GroupElement = InstanceType<typeof Group>;
