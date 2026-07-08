import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { CheckboxItem } from "./parts/CheckboxItem";
import { Group } from "./parts/Group";
import { Item } from "./parts/Item";
import { Toggle } from "./parts/Toggle";

const definitions = [
  ["aria-treeview", Root],
  ["aria-treeview-checkbox-item", CheckboxItem],
  ["aria-treeview-group", Group],
  ["aria-treeview-item", Item],
  ["aria-treeview-toggle", Toggle],
] as const;

export function defineTreeviewElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
