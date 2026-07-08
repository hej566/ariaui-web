import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Close");

export const getPartSpec = helpers.getPartSpec;
export const createToastElement = helpers.createElement;

export type ToastHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineToastElements } from "./define";
export { defineToastElements as defineElements } from "./define";
export { createToastElement as createElement };
