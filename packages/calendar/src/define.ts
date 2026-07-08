import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Body } from "./parts/Body";
import { Cell } from "./parts/Cell";
import { Header } from "./parts/Header";
import { Row } from "./parts/Row";
import { Select } from "./parts/Select";

const definitions = [
  ["aria-calendar", Root],
  ["aria-calendar-body", Body],
  ["aria-calendar-cell", Cell],
  ["aria-calendar-header", Header],
  ["aria-calendar-row", Row],
  ["aria-calendar-select", Select],
] as const;

export function defineCalendarElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
