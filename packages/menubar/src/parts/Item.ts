import { createMenubarWebComponent } from "../menubar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Item");

if (!partSpec) {
  throw new Error("Missing Item part spec for @ariaui-web/menubar.");
}

export const Item = createMenubarWebComponent(partSpec);
export type ItemElement = InstanceType<typeof Item>;
