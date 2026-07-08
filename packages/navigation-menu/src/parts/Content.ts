import { createNavigationMenuWebComponent } from "../navigation-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Content");

if (!partSpec) {
  throw new Error("Missing Content part spec for @ariaui-web/navigation-menu.");
}

export const Content = createNavigationMenuWebComponent(partSpec);
export type ContentElement = InstanceType<typeof Content>;
