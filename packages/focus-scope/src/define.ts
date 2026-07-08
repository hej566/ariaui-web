import { defineCustomElement } from "@ariaui-web/utils";
import { FocusScope } from "./parts/FocusScope";

const definitions = [
  ["aria-focus-scope", FocusScope],
] as const;

export function defineFocusScopeElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
