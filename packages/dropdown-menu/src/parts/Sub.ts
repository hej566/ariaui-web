import { createDropdownMenuWebComponent } from "../dropdown-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Sub");

if (!partSpec) {
  throw new Error("Missing Sub part spec for @ariaui-web/dropdown-menu.");
}

export const Sub = createDropdownMenuWebComponent(partSpec);
export type SubElement = InstanceType<typeof Sub>;
