import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createDropdownMenuElement = helpers.createElement;

export type DropdownMenuHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineDropdownMenuElements } from "./define";
export { defineDropdownMenuElements as defineElements } from "./define";
export { createDropdownMenuElement as createElement };
