import { defineCustomElement } from "@ariaui-web/utils";
import { definePortalElements } from "@ariaui-web/portal";
import { Root } from "./parts/Root";
import { Trigger } from "./parts/Trigger";
import { Content } from "./parts/Content";
import { Item } from "./parts/Item";
import { CheckboxItem } from "./parts/CheckboxItem";
import { RadioGroup } from "./parts/RadioGroup";
import { RadioItem } from "./parts/RadioItem";
import { Sub } from "./parts/Sub";
import { SubTrigger } from "./parts/SubTrigger";
import { SubContent } from "./parts/SubContent";
import { Group } from "./parts/Group";
import { Label } from "./parts/Label";
import { Separator } from "./parts/Separator";

const definitions = [
  ["aria-dropdown-menu", Root],
  ["aria-dropdown-menu-trigger", Trigger],
  ["aria-dropdown-menu-content", Content],
  ["aria-dropdown-menu-item", Item],
  ["aria-dropdown-menu-checkbox-item", CheckboxItem],
  ["aria-dropdown-menu-radio-group", RadioGroup],
  ["aria-dropdown-menu-radio-item", RadioItem],
  ["aria-dropdown-menu-sub", Sub],
  ["aria-dropdown-menu-sub-trigger", SubTrigger],
  ["aria-dropdown-menu-sub-content", SubContent],
  ["aria-dropdown-menu-group", Group],
  ["aria-dropdown-menu-label", Label],
  ["aria-dropdown-menu-separator", Separator],
] as const;

export function defineDropdownMenuElements() {
  definePortalElements();

  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
