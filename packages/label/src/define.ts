import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const definitions = [
  ["aria-label", Root],
] as const;

export function defineLabelElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
