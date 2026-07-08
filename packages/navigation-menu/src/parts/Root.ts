import { createNavigationMenuWebComponent } from "../navigation-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/navigation-menu.");
}

export const Root = createNavigationMenuWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
