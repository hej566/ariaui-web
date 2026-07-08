import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Fallback } from "./parts/Fallback";
import { Group } from "./parts/Group";
import { Image } from "./parts/Image";

const definitions = [
  ["aria-avatar", Root],
  ["aria-avatar-fallback", Fallback],
  ["aria-avatar-group", Group],
  ["aria-avatar-image", Image],
] as const;

export function defineAvatarElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
