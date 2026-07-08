import { createDropdownMenuWebComponent } from "../dropdown-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Content");

if (!partSpec) {
  throw new Error("Missing Content part spec for @ariaui-web/dropdown-menu.");
}

export const Content = createDropdownMenuWebComponent(partSpec);
export type ContentElement = InstanceType<typeof Content>;
