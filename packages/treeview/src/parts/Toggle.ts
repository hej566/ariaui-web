import { createTreeviewWebComponent } from "../treeview-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Toggle");

if (!partSpec) {
  throw new Error("Missing Toggle part spec for @ariaui-web/treeview.");
}

export const Toggle = createTreeviewWebComponent(partSpec);
export type ToggleElement = InstanceType<typeof Toggle>;
