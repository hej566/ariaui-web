import { createDropdownMenuWebComponent } from "../dropdown-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "RadioGroup");

if (!partSpec) {
  throw new Error("Missing RadioGroup part spec for @ariaui-web/dropdown-menu.");
}

export const RadioGroup = createDropdownMenuWebComponent(partSpec);
export type RadioGroupElement = InstanceType<typeof RadioGroup>;
