import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createInputOtpElement = helpers.createElement;

export type InputOtpHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineInputOtpElements } from "./define";
export { defineInputOtpElements as defineElements } from "./define";
export { createInputOtpElement as createElement };
