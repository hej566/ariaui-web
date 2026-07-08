import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Button } from "./parts/Button";
import { Content } from "./parts/Content";
import { Header } from "./parts/Header";
import { Item } from "./parts/Item";
import { Panel } from "./parts/Panel";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-accordion", Root],
  ["aria-accordion-button", Button],
  ["aria-accordion-content", Content],
  ["aria-accordion-header", Header],
  ["aria-accordion-item", Item],
  ["aria-accordion-panel", Panel],
  ["aria-accordion-trigger", Trigger],
] as const;

export function defineAccordionElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
