import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Fallback } from "./parts/Fallback";
import { Group } from "./parts/Group";
import { Image } from "./parts/Image";
import { Root } from "./parts/Root";

const avatarPartConstructors = {
  Fallback,
  Group,
  Image,
  Root,
} as const;

export function createAvatarWebComponent(part: WebComponentPartSpec) {
  const constructor = avatarPartConstructors[part.name as keyof typeof avatarPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/avatar.");
  }

  return constructor;
}
