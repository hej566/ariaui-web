import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createSpinbuttonElement = helpers.createElement;

export type SpinbuttonHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineSpinbuttonElements } from "./define";
export { defineSpinbuttonElements as defineElements } from "./define";
export { createSpinbuttonElement as createElement };
