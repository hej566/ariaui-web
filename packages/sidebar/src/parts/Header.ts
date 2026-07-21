import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "Header")!;
export const Header = createSidebarWebComponent(partSpec);
export type HeaderElement = InstanceType<typeof Header>;
