import { createCarouselWebComponent } from "../carousel-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Slide");

if (!partSpec) {
  throw new Error("Missing Slide part spec for @ariaui-web/carousel.");
}

export const Slide = createCarouselWebComponent(partSpec);
export type SlideElement = InstanceType<typeof Slide>;
