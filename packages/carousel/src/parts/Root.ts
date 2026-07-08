import { createCarouselWebComponent } from "../carousel-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/carousel.");
}

export const Root = createCarouselWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
