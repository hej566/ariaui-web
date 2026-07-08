import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createAvatarElement = helpers.createElement;

export type AvatarHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineAvatarElements } from "./define";
export { defineAvatarElements as defineElements } from "./define";
export { createAvatarElement as createElement };
