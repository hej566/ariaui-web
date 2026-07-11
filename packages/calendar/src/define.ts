import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Header } from "./parts/Header";
import { HeaderPrevious } from "./parts/HeaderPrevious";
import { HeaderMonth } from "./parts/HeaderMonth";
import { HeaderYear } from "./parts/HeaderYear";
import { HeaderNext } from "./parts/HeaderNext";
import { Body } from "./parts/Body";
import { Head } from "./parts/Head";
import { Row } from "./parts/Row";
import { DayHeader } from "./parts/DayHeader";
import { Rows } from "./parts/Rows";
import { Cell } from "./parts/Cell";
import { MonthSelect } from "./parts/MonthSelect";
import { YearSelect } from "./parts/YearSelect";

const definitions = [
  ["aria-calendar", Root],
  ["aria-calendar-header", Header],
  ["aria-calendar-header-previous", HeaderPrevious],
  ["aria-calendar-header-month", HeaderMonth],
  ["aria-calendar-header-year", HeaderYear],
  ["aria-calendar-header-next", HeaderNext],
  ["aria-calendar-body", Body],
  ["aria-calendar-head", Head],
  ["aria-calendar-row", Row],
  ["aria-calendar-day-header", DayHeader],
  ["aria-calendar-rows", Rows],
  ["aria-calendar-cell", Cell],
  ["aria-calendar-month-select", MonthSelect],
  ["aria-calendar-year-select", YearSelect],
] as const;

export function defineCalendarElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
