import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createPopoverElement = helpers.createElement;

export type PopoverHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { definePopoverElements } from "./define";
export { definePopoverElements as defineElements } from "./define";
export { createPopoverElement as createElement };
