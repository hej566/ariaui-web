import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Button } from "./parts/Button";
import { Content } from "./parts/Content";
import { Group } from "./parts/Group";
import { Input } from "./parts/Input";
import { Label } from "./parts/Label";
import { Option } from "./parts/Option";
import { Tag } from "./parts/Tag";
import { TagGroup } from "./parts/TagGroup";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-combobox", Root],
  ["aria-combobox-button", Button],
  ["aria-combobox-content", Content],
  ["aria-combobox-group", Group],
  ["aria-combobox-input", Input],
  ["aria-combobox-label", Label],
  ["aria-combobox-option", Option],
  ["aria-combobox-tag", Tag],
  ["aria-combobox-tag-group", TagGroup],
  ["aria-combobox-trigger", Trigger],
] as const;

export function defineComboboxElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
