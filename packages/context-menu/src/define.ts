import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Content } from "./parts/Content";
import { Group } from "./parts/Group";
import { Item } from "./parts/Item";
import { Label } from "./parts/Label";
import { Separator } from "./parts/Separator";
import { Submenu } from "./parts/Submenu";

const definitions = [
  ["aria-context-menu", Root],
  ["aria-context-menu-content", Content],
  ["aria-context-menu-group", Group],
  ["aria-context-menu-item", Item],
  ["aria-context-menu-label", Label],
  ["aria-context-menu-separator", Separator],
  ["aria-context-menu-submenu", Submenu],
] as const;

export function defineContextMenuElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
