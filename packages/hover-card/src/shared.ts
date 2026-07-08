import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createHoverCardElement = helpers.createElement;

export type HoverCardHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineHoverCardElements } from "./define";
export { defineHoverCardElements as defineElements } from "./define";
export { createHoverCardElement as createElement };
