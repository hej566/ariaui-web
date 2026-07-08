import { createTreeviewWebComponent } from "../treeview-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/treeview.");
}

export const Root = createTreeviewWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
