import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createButtonElement = helpers.createElement;

export type ButtonHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineButtonElements } from "./define";
export { defineButtonElements as defineElements } from "./define";
export { createButtonElement as createElement };
