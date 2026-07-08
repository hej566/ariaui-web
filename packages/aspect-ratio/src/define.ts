import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const definitions = [
  ["aria-aspect-ratio", Root],
] as const;

export function defineAspectRatioElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
