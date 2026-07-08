import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createMenubarElement = helpers.createElement;

export type MenubarHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineMenubarElements } from "./define";
export { defineMenubarElements as defineElements } from "./define";
export { createMenubarElement as createElement };
