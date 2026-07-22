import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Close");

export const getPartSpec = helpers.getPartSpec;
export const createToastElement = helpers.createElement;

export type ToastHostElement = HTMLElement & {
  readonly dataset: DOMStringMap;
  duration: number;
  onClose: (() => void) | null;
  stack: boolean;
  stackOffset: number;
  stackScaleStep: number;
  trigger: HTMLElement | null;
  visibleToasts: number;
};

export { defineToastElements } from "./define";
export { defineToastElements as defineElements } from "./define";
export { createToastElement as createElement };
