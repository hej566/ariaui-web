import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Slot");

export const getPartSpec = helpers.getPartSpec;
export const createSlotElement = helpers.createElement;

export type SlotHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
};

export { defineSlotElements } from "./define";
export { defineSlotElements as defineElements } from "./define";
export { createSlotElement as createElement };
