import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Panel");

if (!partSpec) {
  throw new Error("Missing Panel part spec for @ariaui-web/sidebar.");
}

export const Panel = createSidebarWebComponent(partSpec);
export type PanelElement = InstanceType<typeof Panel>;
