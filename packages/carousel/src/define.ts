import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Container } from "./parts/Container";
import { NextButton } from "./parts/NextButton";
import { PreviousButton } from "./parts/PreviousButton";
import { Slide } from "./parts/Slide";
import { Viewport } from "./parts/Viewport";

const definitions = [
  ["aria-carousel", Root],
  ["aria-carousel-container", Container],
  ["aria-carousel-next-button", NextButton],
  ["aria-carousel-previous-button", PreviousButton],
  ["aria-carousel-slide", Slide],
  ["aria-carousel-viewport", Viewport],
] as const;

export function defineCarouselElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
