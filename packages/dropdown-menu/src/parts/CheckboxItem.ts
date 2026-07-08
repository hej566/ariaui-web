import { createDropdownMenuWebComponent } from "../dropdown-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "CheckboxItem");

if (!partSpec) {
  throw new Error("Missing CheckboxItem part spec for @ariaui-web/dropdown-menu.");
}

export const CheckboxItem = createDropdownMenuWebComponent(partSpec);
export type CheckboxItemElement = InstanceType<typeof CheckboxItem>;
