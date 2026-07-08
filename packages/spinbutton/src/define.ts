import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Decrement } from "./parts/Decrement";
import { Increment } from "./parts/Increment";
import { Input } from "./parts/Input";

const definitions = [
  ["aria-spinbutton", Root],
  ["aria-spinbutton-decrement", Decrement],
  ["aria-spinbutton-increment", Increment],
  ["aria-spinbutton-input", Input],
] as const;

export function defineSpinbuttonElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
