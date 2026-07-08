import { createContextMenuWebComponent } from "../context-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Separator");

if (!partSpec) {
  throw new Error("Missing Separator part spec for @ariaui-web/context-menu.");
}

export const Separator = createContextMenuWebComponent(partSpec);
export type SeparatorElement = InstanceType<typeof Separator>;
