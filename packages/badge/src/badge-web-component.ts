import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const badgePartConstructors = {
  Root,
} as const;

export function createBadgeWebComponent(part: WebComponentPartSpec) {
  const constructor = badgePartConstructors[part.name as keyof typeof badgePartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/badge.");
  }

  return constructor;
}
