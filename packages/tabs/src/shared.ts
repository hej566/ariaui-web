import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createTabsElement = helpers.createElement;

export type TabsHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineTabsElements } from "./define";
export { defineTabsElements as defineElements } from "./define";
export { createTabsElement as createElement };
