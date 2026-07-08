import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Range } from "./parts/Range";
import { Thumb } from "./parts/Thumb";
import { Track } from "./parts/Track";

const definitions = [
  ["aria-slider", Root],
  ["aria-slider-range", Range],
  ["aria-slider-thumb", Thumb],
  ["aria-slider-track", Track],
] as const;

export function defineSliderElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
