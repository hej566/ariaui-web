import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { CheckboxItem } from "./parts/CheckboxItem";
import { Content } from "./parts/Content";
import { Group } from "./parts/Group";
import { Item } from "./parts/Item";
import { ItemIndicator } from "./parts/ItemIndicator";
import { Label } from "./parts/Label";
import { Menu } from "./parts/Menu";
import { RadioGroup } from "./parts/RadioGroup";
import { RadioItem } from "./parts/RadioItem";
import { Separator } from "./parts/Separator";
import { Sub } from "./parts/Sub";
import { SubContent } from "./parts/SubContent";
import { Submenu } from "./parts/Submenu";
import { SubTrigger } from "./parts/SubTrigger";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-menubar", Root],
  ["aria-menubar-checkbox-item", CheckboxItem],
  ["aria-menubar-content", Content],
  ["aria-menubar-group", Group],
  ["aria-menubar-item", Item],
  ["aria-menubar-item-indicator", ItemIndicator],
  ["aria-menubar-label", Label],
  ["aria-menubar-menu", Menu],
  ["aria-menubar-radio-group", RadioGroup],
  ["aria-menubar-radio-item", RadioItem],
  ["aria-menubar-separator", Separator],
  ["aria-menubar-sub", Sub],
  ["aria-menubar-sub-content", SubContent],
  ["aria-menubar-submenu", Submenu],
  ["aria-menubar-sub-trigger", SubTrigger],
  ["aria-menubar-trigger", Trigger],
] as const;

export function defineMenubarElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
