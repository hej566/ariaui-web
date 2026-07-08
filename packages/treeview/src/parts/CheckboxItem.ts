import { createTreeviewWebComponent } from "../treeview-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "CheckboxItem");

if (!partSpec) {
  throw new Error("Missing CheckboxItem part spec for @ariaui-web/treeview.");
}

export const CheckboxItem = createTreeviewWebComponent(partSpec);
export type CheckboxItemElement = InstanceType<typeof CheckboxItem>;
