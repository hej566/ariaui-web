import { createSliderWebComponent } from "../slider-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Track");

if (!partSpec) {
  throw new Error("Missing Track part spec for @ariaui-web/slider.");
}

export const Track = createSliderWebComponent(partSpec);
export type TrackElement = InstanceType<typeof Track>;
