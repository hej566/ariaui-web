import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createTreeviewElement = helpers.createElement;

export type TreeviewHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineTreeviewElements } from "./define";
export { defineTreeviewElements as defineElements } from "./define";
export { createTreeviewElement as createElement };
