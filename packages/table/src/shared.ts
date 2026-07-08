import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createTableElement = helpers.createElement;

export type TableHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineTableElements } from "./define";
export { defineTableElements as defineElements } from "./define";
export { createTableElement as createElement };
