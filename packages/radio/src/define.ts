import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Indicator } from "./parts/Indicator";
import { Item } from "./parts/Item";

const definitions = [
  ["aria-radio", Root],
  ["aria-radio-item", Item],
  ["aria-radio-indicator", Indicator],
] as const;

export function defineRadioElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
