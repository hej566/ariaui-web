import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "GroupLabel")!;
export const GroupLabel = createSidebarWebComponent(partSpec);
export type GroupLabelElement = InstanceType<typeof GroupLabel>;
