import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const definitions = [
  ["aria-spinner", Root],
] as const;

export function defineSpinnerElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
