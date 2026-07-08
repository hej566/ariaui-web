import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Panel } from "./parts/Panel";
import { Separator } from "./parts/Separator";

const definitions = [
  ["aria-splitter", Root],
  ["aria-splitter-panel", Panel],
  ["aria-splitter-separator", Separator],
] as const;

export function defineSplitterElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
