import { createSliderWebComponent } from "../slider-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Range");

if (!partSpec) {
  throw new Error("Missing Range part spec for @ariaui-web/slider.");
}

export const Range = createSliderWebComponent(partSpec);
export type RangeElement = InstanceType<typeof Range>;
