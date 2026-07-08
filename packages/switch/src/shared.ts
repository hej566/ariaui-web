import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createSwitchElement = helpers.createElement;

export type SwitchHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineSwitchElements } from "./define";
export { defineSwitchElements as defineElements } from "./define";
export { createSwitchElement as createElement };
