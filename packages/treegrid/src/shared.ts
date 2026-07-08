import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createTreegridElement = helpers.createElement;

export type TreegridHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineTreegridElements } from "./define";
export { defineTreegridElements as defineElements } from "./define";
export { createTreegridElement as createElement };
