import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "FocusScope");

export const getPartSpec = helpers.getPartSpec;
export const createFocusScopeElement = helpers.createElement;

export type FocusScopeHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineFocusScopeElements } from "./define";
export { defineFocusScopeElements as defineElements } from "./define";
export { createFocusScopeElement as createElement };
