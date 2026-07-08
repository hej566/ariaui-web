import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createComboboxElement = helpers.createElement;

export type ComboboxHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineComboboxElements } from "./define";
export { defineComboboxElements as defineElements } from "./define";
export { createComboboxElement as createElement };
