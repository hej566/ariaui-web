import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createToggleGroupElement = helpers.createElement;

export type ToggleGroupHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineToggleGroupElements } from "./define";
export { defineToggleGroupElements as defineElements } from "./define";
export { createToggleGroupElement as createElement };
