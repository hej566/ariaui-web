import { createListboxWebComponent } from "../listbox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Group");

if (!partSpec) {
  throw new Error("Missing Group part spec for @ariaui-web/listbox.");
}

export const Group = createListboxWebComponent(partSpec);
export type GroupElement = InstanceType<typeof Group>;
