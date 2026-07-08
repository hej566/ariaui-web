import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createDialogElement = helpers.createElement;

export type DialogHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineDialogElements } from "./define";
export { defineDialogElements as defineElements } from "./define";
export { createDialogElement as createElement };
