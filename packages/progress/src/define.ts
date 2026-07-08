import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Indicator } from "./parts/Indicator";

const definitions = [
  ["aria-progress", Root],
  ["aria-progress-indicator", Indicator],
] as const;

export function defineProgressElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
