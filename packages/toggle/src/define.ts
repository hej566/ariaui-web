import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const definitions = [
  ["aria-toggle", Root],
] as const;

export function defineToggleElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
