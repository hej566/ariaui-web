import { createSelectWebComponent } from "../select-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "DropdownIndicator");

if (!partSpec) {
  throw new Error("Missing DropdownIndicator part spec for @ariaui-web/select.");
}

export const DropdownIndicator = createSelectWebComponent(partSpec);
export type DropdownIndicatorElement = InstanceType<typeof DropdownIndicator>;
