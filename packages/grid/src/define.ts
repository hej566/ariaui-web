import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Body } from "./parts/Body";
import { Cell } from "./parts/Cell";
import { Head } from "./parts/Head";
import { Header } from "./parts/Header";
import { Row } from "./parts/Row";

const definitions = [
  ["aria-grid", Root],
  ["aria-grid-body", Body],
  ["aria-grid-cell", Cell],
  ["aria-grid-head", Head],
  ["aria-grid-header", Header],
  ["aria-grid-row", Row],
] as const;

export function defineGridElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
