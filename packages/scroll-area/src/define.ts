import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Viewport } from "./parts/Viewport";
import { ScrollUpButton } from "./parts/ScrollUpButton";
import { ScrollDownButton } from "./parts/ScrollDownButton";
import { Scrollbar } from "./parts/Scrollbar";
import { Thumb } from "./parts/Thumb";
import { Corner } from "./parts/Corner";

const definitions = [
  ["aria-scroll-area", Root],
  ["aria-scroll-area-viewport", Viewport],
  ["aria-scroll-area-scroll-up-button", ScrollUpButton],
  ["aria-scroll-area-scroll-down-button", ScrollDownButton],
  ["aria-scroll-area-scrollbar", Scrollbar],
  ["aria-scroll-area-thumb", Thumb],
  ["aria-scroll-area-corner", Corner],
] as const;

export function defineScrollAreaElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
