import { createDropdownMenuWebComponent } from "../dropdown-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Separator");

if (!partSpec) {
  throw new Error("Missing Separator part spec for @ariaui-web/dropdown-menu.");
}

export const Separator = createDropdownMenuWebComponent(partSpec);
export type SeparatorElement = InstanceType<typeof Separator>;
