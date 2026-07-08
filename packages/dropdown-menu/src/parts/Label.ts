import { createDropdownMenuWebComponent } from "../dropdown-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Label");

if (!partSpec) {
  throw new Error("Missing Label part spec for @ariaui-web/dropdown-menu.");
}

export const Label = createDropdownMenuWebComponent(partSpec);
export type LabelElement = InstanceType<typeof Label>;
