import { createMenubarWebComponent } from "../menubar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Submenu");

if (!partSpec) {
  throw new Error("Missing Submenu part spec for @ariaui-web/menubar.");
}

export const Submenu = createMenubarWebComponent(partSpec);
export type SubmenuElement = InstanceType<typeof Submenu>;
