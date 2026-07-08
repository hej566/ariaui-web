import { createNavigationMenuWebComponent } from "../navigation-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Submenu");

if (!partSpec) {
  throw new Error("Missing Submenu part spec for @ariaui-web/navigation-menu.");
}

export const Submenu = createNavigationMenuWebComponent(partSpec);
export type SubmenuElement = InstanceType<typeof Submenu>;
