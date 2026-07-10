import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const labelPartConstructors = {
  Root,
} as const;

export function createLabelWebComponent(part: WebComponentPartSpec) {
  const constructor = labelPartConstructors[part.name as keyof typeof labelPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/label.");
  }

  return constructor;
}
