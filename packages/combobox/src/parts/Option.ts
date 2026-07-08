import { createComboboxWebComponent } from "../combobox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Option");

if (!partSpec) {
  throw new Error("Missing Option part spec for @ariaui-web/combobox.");
}

export const Option = createComboboxWebComponent(partSpec);
export type OptionElement = InstanceType<typeof Option>;
