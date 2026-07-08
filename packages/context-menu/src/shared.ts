import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createContextMenuElement = helpers.createElement;

export type ContextMenuHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineContextMenuElements } from "./define";
export { defineContextMenuElements as defineElements } from "./define";
export { createContextMenuElement as createElement };
