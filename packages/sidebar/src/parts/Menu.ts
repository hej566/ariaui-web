import { createSidebarWebComponent } from "../sidebar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Menu");

if (!partSpec) {
  throw new Error("Missing Menu part spec for @ariaui-web/sidebar.");
}

export const Menu = createSidebarWebComponent(partSpec);
export type MenuElement = InstanceType<typeof Menu>;
