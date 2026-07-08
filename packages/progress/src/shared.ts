import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createProgressElement = helpers.createElement;

export type ProgressHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineProgressElements } from "./define";
export { defineProgressElements as defineElements } from "./define";
export { createProgressElement as createElement };
