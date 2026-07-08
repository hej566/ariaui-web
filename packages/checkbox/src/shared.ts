import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createCheckboxElement = helpers.createElement;

export type CheckboxHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineCheckboxElements } from "./define";
export { defineCheckboxElements as defineElements } from "./define";
export { createCheckboxElement as createElement };
