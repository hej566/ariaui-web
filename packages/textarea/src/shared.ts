import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createTextareaElement = helpers.createElement;

export type TextareaHostElement = HTMLElement & {
  readonly control: HTMLTextAreaElement;
  readonly dataset: DOMStringMap;
  value: string;
};

export { defineTextareaElements } from "./define";
export { defineTextareaElements as defineElements } from "./define";
export { createTextareaElement as createElement };
