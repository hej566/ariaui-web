import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const arrowPartConstructors = {
  Root,
} as const;

export function createArrowWebComponent(part: WebComponentPartSpec) {
  const constructor = arrowPartConstructors[part.name as keyof typeof arrowPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/arrow.");
  }

  return constructor;
}
