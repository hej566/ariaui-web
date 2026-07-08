import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Content } from "./parts/Content";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-hover-card", Root],
  ["aria-hover-card-content", Content],
  ["aria-hover-card-trigger", Trigger],
] as const;

export function defineHoverCardElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
