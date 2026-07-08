import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createAccordionElement = helpers.createElement;

export type AccordionHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineAccordionElements } from "./define";
export { defineAccordionElements as defineElements } from "./define";
export { createAccordionElement as createElement };
