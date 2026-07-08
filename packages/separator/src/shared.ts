import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createSeparatorElement = helpers.createElement;

export type SeparatorHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineSeparatorElements } from "./define";
export { defineSeparatorElements as defineElements } from "./define";
export { createSeparatorElement as createElement };
