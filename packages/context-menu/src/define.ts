import { defineCustomElement } from "@ariaui-web/utils";
import { definePortalElements } from "@ariaui-web/portal";
import { Root } from "./parts/Root";
import { Content } from "./parts/Content";
import { Item } from "./parts/Item";
import { Sub } from "./parts/Sub";
import { SubTrigger } from "./parts/SubTrigger";
import { SubContent } from "./parts/SubContent";
import { Group } from "./parts/Group";
import { Label } from "./parts/Label";
import { Separator } from "./parts/Separator";

const definitions = [
  ["aria-context-menu", Root],
  ["aria-context-menu-content", Content],
  ["aria-context-menu-item", Item],
  ["aria-context-menu-sub", Sub],
  ["aria-context-menu-sub-trigger", SubTrigger],
  ["aria-context-menu-sub-content", SubContent],
  ["aria-context-menu-group", Group],
  ["aria-context-menu-label", Label],
  ["aria-context-menu-separator", Separator],
] as const;

export function defineContextMenuElements() {
  definePortalElements();

  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
