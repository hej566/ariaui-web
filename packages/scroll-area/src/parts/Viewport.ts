import { createScrollAreaWebComponent } from "../scroll-area-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Viewport");

if (!partSpec) {
  throw new Error("Missing Viewport part spec for @ariaui-web/scroll-area.");
}

export const Viewport = createScrollAreaWebComponent(partSpec);
export type ViewportElement = InstanceType<typeof Viewport>;
