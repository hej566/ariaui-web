import { createComponentPartHelpers } from "@ariaui-web/utils";
import { componentSpec } from "./component-spec";

const helpers = createComponentPartHelpers(componentSpec, "Root");

export const getPartSpec = helpers.getPartSpec;
export const createTooltipElement = helpers.createElement;

export type TooltipHostElement = HTMLElement & {
  readonly control: HTMLElement | null;
  defaultOpen: boolean;
  offset: number;
  onOpenChange: ((open: boolean) => void) | null;
  open: boolean;
  placement: string;
  readonly dataset: DOMStringMap;
};

export { defineTooltipElements } from "./define";
export { defineTooltipElements as defineElements } from "./define";
export { createTooltipElement as createElement };
