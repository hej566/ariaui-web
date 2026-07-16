import { defineCustomElement } from "@ariaui-web/utils";
import { defineCalendarElements } from "@ariaui-web/calendar";
import { Root } from "./parts/Root";
import { Label } from "./parts/Label";
import { Trigger } from "./parts/Trigger";
import { Input } from "./parts/Input";
import { Content } from "./parts/Content";
import { Calendar } from "./parts/Calendar";
import { CalendarHeader } from "./parts/CalendarHeader";
import { CalendarPrevious } from "./parts/CalendarPrevious";
import { CalendarMonth } from "./parts/CalendarMonth";
import { CalendarMonthSelect } from "./parts/CalendarMonthSelect";
import { CalendarYear } from "./parts/CalendarYear";
import { CalendarYearSelect } from "./parts/CalendarYearSelect";
import { CalendarNext } from "./parts/CalendarNext";
import { CalendarBody } from "./parts/CalendarBody";

const definitions = [
  ["aria-datepicker", Root],
  ["aria-datepicker-label", Label],
  ["aria-datepicker-trigger", Trigger],
  ["aria-datepicker-input", Input],
  ["aria-datepicker-content", Content],
  ["aria-datepicker-calendar", Calendar],
  ["aria-datepicker-calendar-header", CalendarHeader],
  ["aria-datepicker-calendar-previous", CalendarPrevious],
  ["aria-datepicker-calendar-month", CalendarMonth],
  ["aria-datepicker-calendar-month-select", CalendarMonthSelect],
  ["aria-datepicker-calendar-year", CalendarYear],
  ["aria-datepicker-calendar-year-select", CalendarYearSelect],
  ["aria-datepicker-calendar-next", CalendarNext],
  ["aria-datepicker-calendar-body", CalendarBody],
] as const;

export function defineDatepickerElements() {
  defineCalendarElements();

  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
