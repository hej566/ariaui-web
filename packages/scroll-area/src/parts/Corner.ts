import { createScrollAreaWebComponent } from "../scroll-area-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Corner");

if (!partSpec) {
  throw new Error("Missing Corner part spec for @ariaui-web/scroll-area.");
}

export const Corner = createScrollAreaWebComponent(partSpec);
export type CornerElement = InstanceType<typeof Corner>;
