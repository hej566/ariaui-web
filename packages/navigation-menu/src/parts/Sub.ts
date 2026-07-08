import { createNavigationMenuWebComponent } from "../navigation-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Sub");

if (!partSpec) {
  throw new Error("Missing Sub part spec for @ariaui-web/navigation-menu.");
}

export const Sub = createNavigationMenuWebComponent(partSpec);
export type SubElement = InstanceType<typeof Sub>;
