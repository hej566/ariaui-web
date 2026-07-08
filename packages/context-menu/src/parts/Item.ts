import { createContextMenuWebComponent } from "../context-menu-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Item");

if (!partSpec) {
  throw new Error("Missing Item part spec for @ariaui-web/context-menu.");
}

export const Item = createContextMenuWebComponent(partSpec);
export type ItemElement = InstanceType<typeof Item>;
