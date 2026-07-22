import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createSkeletonElement = helpers.createElement;

export type SkeletonHostElement = HTMLElement & {
  height: string | number;
  loading: boolean;
  maxHeight: string | number;
  maxWidth: string | number;
  minHeight: string | number;
  minWidth: string | number;
  nativeComposition: boolean;
  readonly dataset: DOMStringMap;
  width: string | number;
};

export { defineSkeletonElements } from "./define";
export { defineSkeletonElements as defineElements } from "./define";
export { createSkeletonElement as createElement };
