import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createBadgeElement = helpers.createElement;

export type BadgeHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineBadgeElements } from "./define";
export { defineBadgeElements as defineElements } from "./define";
export { createBadgeElement as createElement };
