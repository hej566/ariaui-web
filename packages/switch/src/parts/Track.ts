import { createSwitchWebComponent } from "../switch-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Track");

if (!partSpec) {
  throw new Error("Missing Track part spec for @ariaui-web/switch.");
}

export const Track = createSwitchWebComponent(partSpec);
export type TrackElement = InstanceType<typeof Track>;
