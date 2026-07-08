import { createCarouselWebComponent } from "../carousel-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Container");

if (!partSpec) {
  throw new Error("Missing Container part spec for @ariaui-web/carousel.");
}

export const Container = createCarouselWebComponent(partSpec);
export type ContainerElement = InstanceType<typeof Container>;
