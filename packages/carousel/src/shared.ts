import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createCarouselElement = helpers.createElement;

export type CarouselHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineCarouselElements } from "./define";
export { defineCarouselElements as defineElements } from "./define";
export { createCarouselElement as createElement };
