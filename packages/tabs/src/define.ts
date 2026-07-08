import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Content } from "./parts/Content";
import { List } from "./parts/List";
import { Panel } from "./parts/Panel";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-tabs", Root],
  ["aria-tabs-content", Content],
  ["aria-tabs-list", List],
  ["aria-tabs-panel", Panel],
  ["aria-tabs-trigger", Trigger],
] as const;

export function defineTabsElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
