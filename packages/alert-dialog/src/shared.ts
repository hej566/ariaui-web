import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createAlertDialogElement = helpers.createElement;

export type AlertDialogHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineAlertDialogElements } from "./define";
export { defineAlertDialogElements as defineElements } from "./define";
export { createAlertDialogElement as createElement };
