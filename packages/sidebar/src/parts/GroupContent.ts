import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "GroupContent")!;
export const GroupContent = createSidebarWebComponent(partSpec);
export type GroupContentElement = InstanceType<typeof GroupContent>;
