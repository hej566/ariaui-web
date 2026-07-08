import { createListboxWebComponent } from "../listbox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Label");

if (!partSpec) {
  throw new Error("Missing Label part spec for @ariaui-web/listbox.");
}

export const Label = createListboxWebComponent(partSpec);
export type LabelElement = InstanceType<typeof Label>;
