import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Content } from "./parts/Content";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-tooltip", Root],
  ["aria-tooltip-content", Content],
  ["aria-tooltip-trigger", Trigger],
] as const;

export function defineTooltipElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
