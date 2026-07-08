import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createScrollAreaElement = helpers.createElement;

export type ScrollAreaHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineScrollAreaElements } from "./define";
export { defineScrollAreaElements as defineElements } from "./define";
export { createScrollAreaElement as createElement };
