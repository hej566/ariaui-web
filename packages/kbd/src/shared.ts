import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createKbdElement = helpers.createElement;

export type KbdHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineKbdElements } from "./define";
export { defineKbdElements as defineElements } from "./define";
export { createKbdElement as createElement };
