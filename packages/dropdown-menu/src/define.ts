import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { CheckboxItem } from "./parts/CheckboxItem";
import { Content } from "./parts/Content";
import { Group } from "./parts/Group";
import { Item } from "./parts/Item";
import { Label } from "./parts/Label";
import { RadioGroup } from "./parts/RadioGroup";
import { RadioItem } from "./parts/RadioItem";
import { Separator } from "./parts/Separator";
import { Sub } from "./parts/Sub";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-dropdown-menu", Root],
  ["aria-dropdown-menu-checkbox-item", CheckboxItem],
  ["aria-dropdown-menu-content", Content],
  ["aria-dropdown-menu-group", Group],
  ["aria-dropdown-menu-item", Item],
  ["aria-dropdown-menu-label", Label],
  ["aria-dropdown-menu-radio-group", RadioGroup],
  ["aria-dropdown-menu-radio-item", RadioItem],
  ["aria-dropdown-menu-separator", Separator],
  ["aria-dropdown-menu-sub", Sub],
  ["aria-dropdown-menu-trigger", Trigger],
] as const;

export function defineDropdownMenuElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
