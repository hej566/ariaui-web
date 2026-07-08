import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Group } from "./parts/Group";

const definitions = [
  ["aria-kbd", Root],
  ["aria-kbd-group", Group],
] as const;

export function defineKbdElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
