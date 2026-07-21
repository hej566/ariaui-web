import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "MenuSubItem")!;
export const MenuSubItem = createSidebarWebComponent(partSpec);
export type MenuSubItemElement = InstanceType<typeof MenuSubItem>;
