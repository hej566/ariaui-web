import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "MenuItem")!;
export const MenuItem = createSidebarWebComponent(partSpec);
export type MenuItemElement = InstanceType<typeof MenuItem>;
