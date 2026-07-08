import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const definitions = [
  ["aria-arrow", Root],
] as const;

export function defineArrowElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
