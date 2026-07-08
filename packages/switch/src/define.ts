import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Thumb } from "./parts/Thumb";
import { Track } from "./parts/Track";

const definitions = [
  ["aria-switch", Root],
  ["aria-switch-thumb", Thumb],
  ["aria-switch-track", Track],
] as const;

export function defineSwitchElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
