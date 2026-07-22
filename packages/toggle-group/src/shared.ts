import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createToggleGroupElement = helpers.createElement;

export type ToggleGroupHostElement = HTMLElement & {
  readonly control: HTMLButtonElement | null;
  defaultValue: string | string[] | null;
  isActive: boolean;
  mode: "single" | "multiple";
  onActiveChange: ((active: boolean[]) => void) | null;
  onValueChange: ((value: string | string[] | null) => void) | null;
  value: string | string[] | null;
  readonly dataset: DOMStringMap;
};

export { defineToggleGroupElements } from "./define";
export { defineToggleGroupElements as defineElements } from "./define";
export { createToggleGroupElement as createElement };
