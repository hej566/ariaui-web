import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "MenuAction")!;
export const MenuAction = createSidebarWebComponent(partSpec);
export type MenuActionElement = InstanceType<typeof MenuAction>;
