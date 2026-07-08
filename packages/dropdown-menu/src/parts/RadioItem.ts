import { createDropdownMenuWebComponent } from "../dropdown-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "RadioItem");

if (!partSpec) {
  throw new Error("Missing RadioItem part spec for @ariaui-web/dropdown-menu.");
}

export const RadioItem = createDropdownMenuWebComponent(partSpec);
export type RadioItemElement = InstanceType<typeof RadioItem>;
