import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const aspectRatioPartConstructors = {
  Root,
} as const;

export function createAspectRatioWebComponent(part: WebComponentPartSpec) {
  const constructor = aspectRatioPartConstructors[part.name as keyof typeof aspectRatioPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/aspect-ratio.");
  }

  return constructor;
}
