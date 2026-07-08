import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createDisclosureElement = helpers.createElement;

export type DisclosureHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineDisclosureElements } from "./define";
export { defineDisclosureElements as defineElements } from "./define";
export { createDisclosureElement as createElement };
