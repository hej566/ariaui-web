import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createSplitterElement = helpers.createElement;

export type SplitterHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineSplitterElements } from "./define";
export { defineSplitterElements as defineElements } from "./define";
export { createSplitterElement as createElement };
