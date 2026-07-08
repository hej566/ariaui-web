import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Item } from "./parts/Item";
import { List } from "./parts/List";
import { Selector } from "./parts/Selector";

const definitions = [
  ["aria-upload", Root],
  ["aria-upload-item", Item],
  ["aria-upload-list", List],
  ["aria-upload-selector", Selector],
] as const;

export function defineUploadElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
