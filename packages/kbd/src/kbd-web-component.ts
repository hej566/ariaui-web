import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Group } from "./parts/Group";
import { Root } from "./parts/Root";

const kbdPartConstructors = {
  Group,
  Root,
} as const;

export function createKbdWebComponent(part: WebComponentPartSpec) {
  const constructor = kbdPartConstructors[part.name as keyof typeof kbdPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/kbd.");
  }

  return constructor;
}
