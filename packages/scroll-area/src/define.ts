import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Corner } from "./parts/Corner";
import { Scrollbar } from "./parts/Scrollbar";
import { ScrollDownButton } from "./parts/ScrollDownButton";
import { ScrollUpButton } from "./parts/ScrollUpButton";
import { Thumb } from "./parts/Thumb";
import { Viewport } from "./parts/Viewport";

const definitions = [
  ["aria-scroll-area", Root],
  ["aria-scroll-area-corner", Corner],
  ["aria-scroll-area-scrollbar", Scrollbar],
  ["aria-scroll-area-scroll-down-button", ScrollDownButton],
  ["aria-scroll-area-scroll-up-button", ScrollUpButton],
  ["aria-scroll-area-thumb", Thumb],
  ["aria-scroll-area-viewport", Viewport],
] as const;

export function defineScrollAreaElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
