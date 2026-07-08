import { createMenubarWebComponent } from "../menubar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Group");

if (!partSpec) {
  throw new Error("Missing Group part spec for @ariaui-web/menubar.");
}

export const Group = createMenubarWebComponent(partSpec);
export type GroupElement = InstanceType<typeof Group>;
