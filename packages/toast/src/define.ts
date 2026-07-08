import { defineCustomElement } from "@ariaui-web/utils";
import { Close } from "./parts/Close";
import { Item } from "./parts/Item";
import { List } from "./parts/List";

const definitions = [
  ["aria-toast-close", Close],
  ["aria-toast-item", Item],
  ["aria-toast-list", List],
] as const;

export function defineToastElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
