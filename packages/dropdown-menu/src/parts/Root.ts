import { createDropdownMenuWebComponent } from "../dropdown-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/dropdown-menu.");
}

export const Root = createDropdownMenuWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
