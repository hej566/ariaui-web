import { createTreeviewWebComponent } from "../treeview-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Item");

if (!partSpec) {
  throw new Error("Missing Item part spec for @ariaui-web/treeview.");
}

export const Item = createTreeviewWebComponent(partSpec);
export type ItemElement = InstanceType<typeof Item>;
