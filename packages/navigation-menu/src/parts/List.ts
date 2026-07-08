import { createNavigationMenuWebComponent } from "../navigation-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "List");

if (!partSpec) {
  throw new Error("Missing List part spec for @ariaui-web/navigation-menu.");
}

export const List = createNavigationMenuWebComponent(partSpec);
export type ListElement = InstanceType<typeof List>;
