import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Group } from "./parts/Group";
import { Item } from "./parts/Item";
import { Root } from "./parts/Root";

const buttonPartConstructors = {
  Group,
  Item,
  Root,
} as const;

export function createButtonWebComponent(part: WebComponentPartSpec) {
  const constructor = buttonPartConstructors[part.name as keyof typeof buttonPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/button.");
  }

  return constructor;
}
