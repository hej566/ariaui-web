import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Content } from "./parts/Content";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-disclosure", Root],
  ["aria-disclosure-content", Content],
  ["aria-disclosure-trigger", Trigger],
] as const;

export function defineDisclosureElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
