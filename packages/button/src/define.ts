import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Group } from "./parts/Group";
import { Item } from "./parts/Item";

const definitions = [
  ["aria-button", Root],
  ["aria-button-group", Group],
  ["aria-button-item", Item],
] as const;

export function defineButtonElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
