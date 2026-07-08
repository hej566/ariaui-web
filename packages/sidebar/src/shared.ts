import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createSidebarElement = helpers.createElement;

export type SidebarHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineSidebarElements } from "./define";
export { defineSidebarElements as defineElements } from "./define";
export { createSidebarElement as createElement };
