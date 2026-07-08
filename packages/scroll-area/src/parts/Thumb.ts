import { createScrollAreaWebComponent } from "../scroll-area-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Thumb");

if (!partSpec) {
  throw new Error("Missing Thumb part spec for @ariaui-web/scroll-area.");
}

export const Thumb = createScrollAreaWebComponent(partSpec);
export type ThumbElement = InstanceType<typeof Thumb>;
