import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createCalendarElement = helpers.createElement;

export type CalendarHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineCalendarElements } from "./define";
export { defineCalendarElements as defineElements } from "./define";
export { createCalendarElement as createElement };
