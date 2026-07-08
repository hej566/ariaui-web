import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Content } from "./parts/Content";
import { Description } from "./parts/Description";
import { Footer } from "./parts/Footer";
import { Header } from "./parts/Header";
import { Title } from "./parts/Title";

const definitions = [
  ["aria-card", Root],
  ["aria-card-content", Content],
  ["aria-card-description", Description],
  ["aria-card-footer", Footer],
  ["aria-card-header", Header],
  ["aria-card-title", Title],
] as const;

export function defineCardElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
