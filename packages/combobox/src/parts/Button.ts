import { createComboboxWebComponent } from "../combobox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Button");

if (!partSpec) {
  throw new Error("Missing Button part spec for @ariaui-web/combobox.");
}

export const Button = createComboboxWebComponent(partSpec);
export type ButtonElement = InstanceType<typeof Button>;
