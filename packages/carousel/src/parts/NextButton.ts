import { createCarouselWebComponent } from "../carousel-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "NextButton");

if (!partSpec) {
  throw new Error("Missing NextButton part spec for @ariaui-web/carousel.");
}

export const NextButton = createCarouselWebComponent(partSpec);
export type NextButtonElement = InstanceType<typeof NextButton>;
