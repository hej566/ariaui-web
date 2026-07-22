import { defineCustomElement } from "@ariaui-web/utils";
import { definePortalElements } from "@ariaui-web/portal";
import { Root } from "./parts/Root";
import { Content } from "./parts/Content";
import { DropdownIndicator } from "./parts/DropdownIndicator";
import { Group } from "./parts/Group";
import { GroupLabel } from "./parts/GroupLabel";
import { Label } from "./parts/Label";
import { Option } from "./parts/Option";
import { Sub } from "./parts/Sub";
import { SubContent } from "./parts/SubContent";
import { SubTrigger } from "./parts/SubTrigger";
import { Tag } from "./parts/Tag";
import { TagGroup } from "./parts/TagGroup";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-select", Root],
  ["aria-select-content", Content],
  ["aria-select-dropdown-indicator", DropdownIndicator],
  ["aria-select-group", Group],
  ["aria-select-group-label", GroupLabel],
  ["aria-select-label", Label],
  ["aria-select-option", Option],
  ["aria-select-sub", Sub],
  ["aria-select-sub-content", SubContent],
  ["aria-select-sub-trigger", SubTrigger],
  ["aria-select-tag", Tag],
  ["aria-select-tag-group", TagGroup],
  ["aria-select-trigger", Trigger],
] as const;

export function defineSelectElements() {
  definePortalElements();
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
