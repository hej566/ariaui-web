import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Body } from "./parts/Body";
import { Cell } from "./parts/Cell";
import { DayHeader } from "./parts/DayHeader";
import { Head } from "./parts/Head";
import { Header } from "./parts/Header";
import { HeaderMonth } from "./parts/HeaderMonth";
import { HeaderNext } from "./parts/HeaderNext";
import { HeaderPrevious } from "./parts/HeaderPrevious";
import { HeaderYear } from "./parts/HeaderYear";
import { MonthSelect } from "./parts/MonthSelect";
import { Root } from "./parts/Root";
import { Row } from "./parts/Row";
import { Rows } from "./parts/Rows";
import { YearSelect } from "./parts/YearSelect";

const calendarPartConstructors = {
  Body,
  Cell,
  DayHeader,
  Head,
  Header,
  HeaderMonth,
  HeaderNext,
  HeaderPrevious,
  HeaderYear,
  MonthSelect,
  Root,
  Row,
  Rows,
  YearSelect,
} as const;

export function createCalendarWebComponent(part: WebComponentPartSpec) {
  const constructor = calendarPartConstructors[part.name as keyof typeof calendarPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/calendar.");
  }

  return constructor;
}
