import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const inputPartConstructors = {
  Root,
} as const;

export function createInputWebComponent(part: WebComponentPartSpec) {
  const constructor = inputPartConstructors[part.name as keyof typeof inputPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/input.");
  }

  return constructor;
}
