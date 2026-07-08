import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createDatepickerElement = helpers.createElement;

export type DatepickerHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineDatepickerElements } from "./define";
export { defineDatepickerElements as defineElements } from "./define";
export { createDatepickerElement as createElement };
