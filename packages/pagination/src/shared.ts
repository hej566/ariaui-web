import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createPaginationElement = helpers.createElement;

export type PaginationHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { definePaginationElements } from "./define";
export { definePaginationElements as defineElements } from "./define";
export { createPaginationElement as createElement };
