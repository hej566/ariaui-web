import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createDrawerElement = helpers.createElement;

export type DrawerHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineDrawerElements } from "./define";
export { defineDrawerElements as defineElements } from "./define";
export { createDrawerElement as createElement };
