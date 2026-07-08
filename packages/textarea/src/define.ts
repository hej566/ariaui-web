import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const definitions = [
  ["aria-textarea", Root],
] as const;

export function defineTextareaElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
