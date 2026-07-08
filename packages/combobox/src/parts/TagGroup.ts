import { createComboboxWebComponent } from "../combobox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "TagGroup");

if (!partSpec) {
  throw new Error("Missing TagGroup part spec for @ariaui-web/combobox.");
}

export const TagGroup = createComboboxWebComponent(partSpec);
export type TagGroupElement = InstanceType<typeof TagGroup>;
