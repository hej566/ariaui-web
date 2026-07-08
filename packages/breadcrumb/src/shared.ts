import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createBreadcrumbElement = helpers.createElement;

export type BreadcrumbHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineBreadcrumbElements } from "./define";
export { defineBreadcrumbElements as defineElements } from "./define";
export { createBreadcrumbElement as createElement };
