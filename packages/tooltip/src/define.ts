import { defineCustomElement } from "@ariaui-web/utils";
import { definePortalElements } from "@ariaui-web/portal";
import { Root } from "./parts/Root";
import { Content } from "./parts/Content";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-tooltip", Root],
  ["aria-tooltip-content", Content],
  ["aria-tooltip-trigger", Trigger],
] as const;

export function defineTooltipElements() {
  definePortalElements();
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
