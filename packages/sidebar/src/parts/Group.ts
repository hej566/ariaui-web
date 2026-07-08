import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Group");

if (!partSpec) {
  throw new Error("Missing Group part spec for @ariaui-web/sidebar.");
}

export const Group = createSidebarWebComponent(partSpec);
export type GroupElement = InstanceType<typeof Group>;
