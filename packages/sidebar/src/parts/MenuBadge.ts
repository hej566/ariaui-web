import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "MenuBadge")!;
export const MenuBadge = createSidebarWebComponent(partSpec);
export type MenuBadgeElement = InstanceType<typeof MenuBadge>;
