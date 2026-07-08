import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Body } from "./parts/Body";
import { Cell } from "./parts/Cell";
import { ColumnHeader } from "./parts/ColumnHeader";
import { Group } from "./parts/Group";
import { Header } from "./parts/Header";
import { Row } from "./parts/Row";
import { RowHeader } from "./parts/RowHeader";

const definitions = [
  ["aria-treegrid", Root],
  ["aria-treegrid-body", Body],
  ["aria-treegrid-cell", Cell],
  ["aria-treegrid-column-header", ColumnHeader],
  ["aria-treegrid-group", Group],
  ["aria-treegrid-header", Header],
  ["aria-treegrid-row", Row],
  ["aria-treegrid-row-header", RowHeader],
] as const;

export function defineTreegridElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
