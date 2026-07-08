import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createSkeletonElement = helpers.createElement;

export type SkeletonHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineSkeletonElements } from "./define";
export { defineSkeletonElements as defineElements } from "./define";
export { createSkeletonElement as createElement };
