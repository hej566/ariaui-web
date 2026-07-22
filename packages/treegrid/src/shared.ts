import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createTreegridElement = helpers.createElement;

export type TreegridHostElement = HTMLElement & {
  defaultExpanded: string[];
  defaultValue: string | string[];
  disabled: boolean;
  expanded: string[];
  multiSelect: boolean;
  onExpandedChange: ((value: string[]) => void) | null;
  onValueChange: ((value: string | string[]) => void) | null;
  value: string;
  readonly dataset: DOMStringMap;
};

export { defineTreegridElements } from "./define";
export { defineTreegridElements as defineElements } from "./define";
export { createTreegridElement as createElement };
