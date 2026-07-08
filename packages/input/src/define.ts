import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const definitions = [
  ["aria-input", Root],
] as const;

export function defineInputElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
