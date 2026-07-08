import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createPortalElement = helpers.createElement;

export type PortalHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { definePortalElements } from "./define";
export { definePortalElements as defineElements } from "./define";
export { createPortalElement as createElement };
