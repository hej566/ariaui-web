import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createSpinnerElement = helpers.createElement;

export type SpinnerHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
  nativeComposition: boolean;
};

export { defineSpinnerElements } from "./define";
export { defineSpinnerElements as defineElements } from "./define";
export { createSpinnerElement as createElement };
