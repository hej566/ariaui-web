import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createAspectRatioElement = helpers.createElement;

export type AspectRatioHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineAspectRatioElements } from "./define";
export { defineAspectRatioElements as defineElements } from "./define";
export { createAspectRatioElement as createElement };
