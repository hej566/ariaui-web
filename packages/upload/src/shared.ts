import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createUploadElement = helpers.createElement;

export type UploadHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineUploadElements } from "./define";
export { defineUploadElements as defineElements } from "./define";
export { createUploadElement as createElement };
