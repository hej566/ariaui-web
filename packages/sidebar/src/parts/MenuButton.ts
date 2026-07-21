import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "MenuButton")!;
export const MenuButton = createSidebarWebComponent(partSpec);
export type MenuButtonElement = InstanceType<typeof MenuButton>;
