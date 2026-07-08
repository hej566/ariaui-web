import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createRadioElement = helpers.createElement;

export type RadioHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineRadioElements } from "./define";
export { defineRadioElements as defineElements } from "./define";
export { createRadioElement as createElement };
