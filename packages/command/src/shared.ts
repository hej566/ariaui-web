import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createCommandElement = helpers.createElement;

export type CommandHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineCommandElements } from "./define";
export { defineCommandElements as defineElements } from "./define";
export { createCommandElement as createElement };
