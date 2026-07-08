import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Body } from "./parts/Body";
import { Caption } from "./parts/Caption";
import { Cell } from "./parts/Cell";
import { ColumnHeader } from "./parts/ColumnHeader";
import { Footer } from "./parts/Footer";
import { Header } from "./parts/Header";
import { Row } from "./parts/Row";
import { RowHeader } from "./parts/RowHeader";

const definitions = [
  ["aria-table", Root],
  ["aria-table-body", Body],
  ["aria-table-caption", Caption],
  ["aria-table-cell", Cell],
  ["aria-table-column-header", ColumnHeader],
  ["aria-table-footer", Footer],
  ["aria-table-header", Header],
  ["aria-table-row", Row],
  ["aria-table-row-header", RowHeader],
] as const;

export function defineTableElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
