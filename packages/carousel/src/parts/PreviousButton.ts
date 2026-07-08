import { createCarouselWebComponent } from "../carousel-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "PreviousButton");

if (!partSpec) {
  throw new Error("Missing PreviousButton part spec for @ariaui-web/carousel.");
}

export const PreviousButton = createCarouselWebComponent(partSpec);
export type PreviousButtonElement = InstanceType<typeof PreviousButton>;
