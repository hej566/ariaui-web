import { createNavigationMenuWebComponent } from "../navigation-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "SubContent");

if (!partSpec) {
  throw new Error("Missing SubContent part spec for @ariaui-web/navigation-menu.");
}

export const SubContent = createNavigationMenuWebComponent(partSpec);
export type SubContentElement = InstanceType<typeof SubContent>;
