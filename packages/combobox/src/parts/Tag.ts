import { createComboboxWebComponent } from "../combobox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Tag");

if (!partSpec) {
  throw new Error("Missing Tag part spec for @ariaui-web/combobox.");
}

export const Tag = createComboboxWebComponent(partSpec);
export type TagElement = InstanceType<typeof Tag>;
