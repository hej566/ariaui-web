import { createSplitterWebComponent } from "../splitter-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Separator");

if (!partSpec) {
  throw new Error("Missing Separator part spec for @ariaui-web/splitter.");
}

export const Separator = createSplitterWebComponent(partSpec);
export type SeparatorElement = InstanceType<typeof Separator>;
