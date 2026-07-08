import { createContextMenuWebComponent } from "../context-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Submenu");

if (!partSpec) {
  throw new Error("Missing Submenu part spec for @ariaui-web/context-menu.");
}

export const Submenu = createContextMenuWebComponent(partSpec);
export type SubmenuElement = InstanceType<typeof Submenu>;
