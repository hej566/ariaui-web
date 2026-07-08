import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createCardElement = helpers.createElement;

export type CardHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineCardElements } from "./define";
export { defineCardElements as defineElements } from "./define";
export { createCardElement as createElement };
