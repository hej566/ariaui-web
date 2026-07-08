import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Group } from "./parts/Group";
import { Indicator } from "./parts/Indicator";
import { Item } from "./parts/Item";

const definitions = [
  ["aria-checkbox", Root],
  ["aria-checkbox-group", Group],
  ["aria-checkbox-indicator", Indicator],
  ["aria-checkbox-item", Item],
] as const;

export function defineCheckboxElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
