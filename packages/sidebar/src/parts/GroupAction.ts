import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "GroupAction")!;
export const GroupAction = createSidebarWebComponent(partSpec);
export type GroupActionElement = InstanceType<typeof GroupAction>;
