import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createListboxElement = helpers.createElement;

export type ListboxHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineListboxElements } from "./define";
export { defineListboxElements as defineElements } from "./define";
export { createListboxElement as createElement };
