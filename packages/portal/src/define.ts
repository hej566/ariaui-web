import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const definitions = [
  ["aria-portal", Root],
] as const;

export function definePortalElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
