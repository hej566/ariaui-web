import { createMenubarWebComponent } from "../menubar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "ItemIndicator");

if (!partSpec) {
  throw new Error("Missing ItemIndicator part spec for @ariaui-web/menubar.");
}

export const ItemIndicator = createMenubarWebComponent(partSpec);
export type ItemIndicatorElement = InstanceType<typeof ItemIndicator>;
