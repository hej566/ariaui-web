import { createNavigationMenuWebComponent } from "../navigation-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "SubTrigger");

if (!partSpec) {
  throw new Error("Missing SubTrigger part spec for @ariaui-web/navigation-menu.");
}

export const SubTrigger = createNavigationMenuWebComponent(partSpec);
export type SubTriggerElement = InstanceType<typeof SubTrigger>;
