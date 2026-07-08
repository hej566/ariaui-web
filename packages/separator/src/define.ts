import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const definitions = [
  ["aria-separator", Root],
] as const;

export function defineSeparatorElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
