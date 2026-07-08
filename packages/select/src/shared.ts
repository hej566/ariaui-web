import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createSelectElement = helpers.createElement;

export type SelectHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineSelectElements } from "./define";
export { defineSelectElements as defineElements } from "./define";
export { createSelectElement as createElement };
