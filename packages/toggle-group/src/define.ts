import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Item } from "./parts/Item";

const definitions = [
  ["aria-toggle-group", Root],
  ["aria-toggle-group-item", Item],
] as const;

export function defineToggleGroupElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
