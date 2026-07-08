import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createAlertElement = helpers.createElement;

export type AlertHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineAlertElements } from "./define";
export { defineAlertElements as defineElements } from "./define";
export { createAlertElement as createElement };
