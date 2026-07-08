import { createCarouselWebComponent } from "../carousel-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Viewport");

if (!partSpec) {
  throw new Error("Missing Viewport part spec for @ariaui-web/carousel.");
}

export const Viewport = createCarouselWebComponent(partSpec);
export type ViewportElement = InstanceType<typeof Viewport>;
