import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createSliderElement = helpers.createElement;

export type SliderHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineSliderElements } from "./define";
export { defineSliderElements as defineElements } from "./define";
export { createSliderElement as createElement };
