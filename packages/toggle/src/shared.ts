import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createToggleElement = helpers.createElement;

export type ToggleHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineToggleElements } from "./define";
export { defineToggleElements as defineElements } from "./define";
export { createToggleElement as createElement };
