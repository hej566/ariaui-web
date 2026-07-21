import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "Content")!;
export const Content = createSidebarWebComponent(partSpec);
export type ContentElement = InstanceType<typeof Content>;
