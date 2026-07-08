import { createSliderWebComponent } from "../slider-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Thumb");

if (!partSpec) {
  throw new Error("Missing Thumb part spec for @ariaui-web/slider.");
}

export const Thumb = createSliderWebComponent(partSpec);
export type ThumbElement = InstanceType<typeof Thumb>;
