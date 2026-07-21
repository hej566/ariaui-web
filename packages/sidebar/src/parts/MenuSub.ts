import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "MenuSub")!;
export const MenuSub = createSidebarWebComponent(partSpec);
export type MenuSubElement = InstanceType<typeof MenuSub>;
