import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createGridElement = helpers.createElement;

export type GridHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineGridElements } from "./define";
export { defineGridElements as defineElements } from "./define";
export { createGridElement as createElement };
