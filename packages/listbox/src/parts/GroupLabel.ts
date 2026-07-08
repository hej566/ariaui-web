import { createListboxWebComponent } from "../listbox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "GroupLabel");

if (!partSpec) {
  throw new Error("Missing GroupLabel part spec for @ariaui-web/listbox.");
}

export const GroupLabel = createListboxWebComponent(partSpec);
export type GroupLabelElement = InstanceType<typeof GroupLabel>;
