import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createArrowElement = helpers.createElement;

export type ArrowHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineArrowElements } from "./define";
export { defineArrowElements as defineElements } from "./define";
export { createArrowElement as createElement };
