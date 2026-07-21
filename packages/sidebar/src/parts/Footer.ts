import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";
const partSpec = componentSpec.parts.find((part) => part.name === "Footer")!;
export const Footer = createSidebarWebComponent(partSpec);
export type FooterElement = InstanceType<typeof Footer>;
