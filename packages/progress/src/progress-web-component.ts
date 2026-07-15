import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Indicator } from "./parts/Indicator";
import { Root } from "./parts/Root";

const progressPartConstructors = {
  Indicator,
  Root,
} as const;

export function createProgressWebComponent(part: WebComponentPartSpec) {
  const constructor = progressPartConstructors[part.name as keyof typeof progressPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/progress.");
  }

  return constructor;
}
