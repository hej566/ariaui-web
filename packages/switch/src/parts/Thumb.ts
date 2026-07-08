import { createSwitchWebComponent } from "../switch-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Thumb");

if (!partSpec) {
  throw new Error("Missing Thumb part spec for @ariaui-web/switch.");
}

export const Thumb = createSwitchWebComponent(partSpec);
export type ThumbElement = InstanceType<typeof Thumb>;
