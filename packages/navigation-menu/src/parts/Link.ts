import { createNavigationMenuWebComponent } from "../navigation-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Link");

if (!partSpec) {
  throw new Error("Missing Link part spec for @ariaui-web/navigation-menu.");
}

export const Link = createNavigationMenuWebComponent(partSpec);
export type LinkElement = InstanceType<typeof Link>;
