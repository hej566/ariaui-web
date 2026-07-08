import { createSplitterWebComponent } from "../splitter-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Panel");

if (!partSpec) {
  throw new Error("Missing Panel part spec for @ariaui-web/splitter.");
}

export const Panel = createSplitterWebComponent(partSpec);
export type PanelElement = InstanceType<typeof Panel>;
