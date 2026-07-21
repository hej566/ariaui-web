import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "MenuSubButton")!;
export const MenuSubButton = createSidebarWebComponent(partSpec);
export type MenuSubButtonElement = InstanceType<typeof MenuSubButton>;
