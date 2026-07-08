import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Content } from "./parts/Content";
import { Item } from "./parts/Item";
import { Link } from "./parts/Link";
import { List } from "./parts/List";
import { Sub } from "./parts/Sub";
import { SubContent } from "./parts/SubContent";
import { Submenu } from "./parts/Submenu";
import { SubTrigger } from "./parts/SubTrigger";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-navigation-menu", Root],
  ["aria-navigation-menu-content", Content],
  ["aria-navigation-menu-item", Item],
  ["aria-navigation-menu-link", Link],
  ["aria-navigation-menu-list", List],
  ["aria-navigation-menu-sub", Sub],
  ["aria-navigation-menu-sub-content", SubContent],
  ["aria-navigation-menu-submenu", Submenu],
  ["aria-navigation-menu-sub-trigger", SubTrigger],
  ["aria-navigation-menu-trigger", Trigger],
] as const;

export function defineNavigationMenuElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
