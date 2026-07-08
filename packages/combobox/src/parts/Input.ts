import { createComboboxWebComponent } from "../combobox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Input");

if (!partSpec) {
  throw new Error("Missing Input part spec for @ariaui-web/combobox.");
}

export const Input = createComboboxWebComponent(partSpec);
export type InputElement = InstanceType<typeof Input>;
