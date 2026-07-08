import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createLabelElement = helpers.createElement;

export type LabelHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineLabelElements } from "./define";
export { defineLabelElements as defineElements } from "./define";
export { createLabelElement as createElement };
