import { createNavigationMenuWebComponent } from "../navigation-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Item");

if (!partSpec) {
  throw new Error("Missing Item part spec for @ariaui-web/navigation-menu.");
}

export const Item = createNavigationMenuWebComponent(partSpec);
export type ItemElement = InstanceType<typeof Item>;
