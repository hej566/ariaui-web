import { createComboboxWebComponent } from "../combobox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/combobox.");
}

export const Root = createComboboxWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
