import { createMenubarWebComponent } from "../menubar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Separator");

if (!partSpec) {
  throw new Error("Missing Separator part spec for @ariaui-web/menubar.");
}

export const Separator = createMenubarWebComponent(partSpec);
export type SeparatorElement = InstanceType<typeof Separator>;
