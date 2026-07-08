import { createDropdownMenuWebComponent } from "../dropdown-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Item");

if (!partSpec) {
  throw new Error("Missing Item part spec for @ariaui-web/dropdown-menu.");
}

export const Item = createDropdownMenuWebComponent(partSpec);
export type ItemElement = InstanceType<typeof Item>;
