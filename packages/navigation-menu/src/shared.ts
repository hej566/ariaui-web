import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createNavigationMenuElement = helpers.createElement;

export type NavigationMenuHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineNavigationMenuElements } from "./define";
export { defineNavigationMenuElements as defineElements } from "./define";
export { createNavigationMenuElement as createElement };
