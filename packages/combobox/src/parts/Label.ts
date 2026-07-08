import { createComboboxWebComponent } from "../combobox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Label");

if (!partSpec) {
  throw new Error("Missing Label part spec for @ariaui-web/combobox.");
}

export const Label = createComboboxWebComponent(partSpec);
export type LabelElement = InstanceType<typeof Label>;
