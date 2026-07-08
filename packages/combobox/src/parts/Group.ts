import { createComboboxWebComponent } from "../combobox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Group");

if (!partSpec) {
  throw new Error("Missing Group part spec for @ariaui-web/combobox.");
}

export const Group = createComboboxWebComponent(partSpec);
export type GroupElement = InstanceType<typeof Group>;
