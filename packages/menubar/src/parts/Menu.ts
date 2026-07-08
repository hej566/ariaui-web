import { createMenubarWebComponent } from "../menubar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Menu");

if (!partSpec) {
  throw new Error("Missing Menu part spec for @ariaui-web/menubar.");
}

export const Menu = createMenubarWebComponent(partSpec);
export type MenuElement = InstanceType<typeof Menu>;
