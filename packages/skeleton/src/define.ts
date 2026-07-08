import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const definitions = [
  ["aria-skeleton", Root],
] as const;

export function defineSkeletonElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
