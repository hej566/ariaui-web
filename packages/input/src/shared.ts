import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createInputElement = helpers.createElement;

export type InputHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineInputElements } from "./define";
export { defineInputElements as defineElements } from "./define";
export { createInputElement as createElement };
