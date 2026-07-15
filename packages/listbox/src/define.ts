import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Content } from "./parts/Content";
import { Group } from "./parts/Group";
import { GroupLabel } from "./parts/GroupLabel";
import { Label } from "./parts/Label";
import { Option } from "./parts/Option";
import { Submenu } from "./parts/Submenu";
import { Viewport } from "./parts/Viewport";

const definitions = [
  ["aria-listbox", Root],
  ["aria-listbox-content", Content],
  ["aria-listbox-group", Group],
  ["aria-listbox-group-label", GroupLabel],
  ["aria-listbox-label", Label],
  ["aria-listbox-option", Option],
  ["aria-listbox-submenu", Submenu],
  ["aria-listbox-viewport", Viewport],
] as const;

export function defineListboxElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
