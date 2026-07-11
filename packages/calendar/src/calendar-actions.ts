import {
  addCalendarDays,
  addCalendarMonths,
  addCalendarYears,
  calendarDatesFromAttribute,
  datePart,
  parseCalendarDate,
} from "./calendar-date";
import {
  calendarCellCoordinates,
  calendarCellDate,
  calendarRoot,
} from "./calendar-dom";
import {
  calendarRootMode,
  calendarRootSelectedDates,
  focusCalendarDate,
  setCalendarSelectedDates,
  setCalendarVisibleMonth,
  shiftCalendarVisibleMonth,
  syncCalendarTreeFromRoot,
} from "./calendar-sync";

function isSpaceKey(event: KeyboardEvent) {
  return event.key === " " || event.key === "Space" || event.key === "Spacebar";
}

function selectableRootDates(root: Element) {
  if (root.hasAttribute("selected-dates")) {
    return calendarDatesFromAttribute(root.getAttribute("selected-dates"));
  }

  return calendarRootSelectedDates(root);
}

export function selectCalendarDate(root: Element, date: Date) {
  const mode = calendarRootMode(root);
  const currentDates = selectableRootDates(root);
  let nextDates: Date[];

  if (mode === "single") {
    nextDates = [date];
  } else {
    const first = currentDates[0] ?? null;
    const second = currentDates[1] ?? null;
    if (!first || second) {
      nextDates = [date];
    } else if (date.getTime() < first.getTime()) {
      nextDates = [date, first];
    } else {
      nextDates = [first, date];
    }
  }

  setCalendarSelectedDates(root, nextDates);
}

export function handleCalendarCellClick(cell: HTMLElement, event: Event) {
  if (event.defaultPrevented || cell.getAttribute("aria-disabled") === "true") {
    return;
  }

  const root = calendarRoot(cell);
  const date = calendarCellDate(cell);
  if (!root || !date) {
    return;
  }

  selectCalendarDate(root, date);
  cell.focus();
}

export function handleCalendarCellFocus(cell: HTMLElement) {
  const root = calendarRoot(cell);
  if (!root) {
    return;
  }

  const grid = cell.closest("aria-calendar-body, [role='grid']");
  if (!grid) {
    return;
  }

  for (const candidate of Array.from(grid.querySelectorAll<HTMLElement>("aria-calendar-cell, [role='gridcell']"))) {
    candidate.setAttribute("tabindex", candidate === cell ? "0" : "-1");
  }
}

function nextDateForKey(cell: HTMLElement, event: KeyboardEvent) {
  const date = calendarCellDate(cell);
  if (!date) {
    return null;
  }

  const coordinates = calendarCellCoordinates(cell);

  switch (event.key) {
    case "ArrowRight":
      return addCalendarDays(date, 1);
    case "ArrowLeft":
      return addCalendarDays(date, -1);
    case "ArrowDown":
      return addCalendarDays(date, 7);
    case "ArrowUp":
      return addCalendarDays(date, -7);
    case "Home":
      return addCalendarDays(date, -coordinates.col);
    case "End":
      return addCalendarDays(date, 6 - coordinates.col);
    case "PageUp":
      return event.shiftKey ? addCalendarYears(date, -1) : addCalendarMonths(date, -1);
    case "PageDown":
      return event.shiftKey ? addCalendarYears(date, 1) : addCalendarMonths(date, 1);
    default:
      return null;
  }
}

export function handleCalendarCellKeyDown(cell: HTMLElement, event: KeyboardEvent) {
  if (event.defaultPrevented) {
    return;
  }

  const root = calendarRoot(cell);
  if (!root) {
    return;
  }

  if (event.key === "Enter" || isSpaceKey(event)) {
    const date = calendarCellDate(cell);
    if (!date || cell.getAttribute("aria-disabled") === "true") {
      return;
    }

    event.preventDefault();
    selectCalendarDate(root, date);
    return;
  }

  const targetDate = nextDateForKey(cell, event);
  if (!targetDate) {
    return;
  }

  event.preventDefault();
  focusCalendarDate(root, targetDate);
}

export function handleCalendarHeaderPrevious(control: HTMLElement, event: Event) {
  if (event.defaultPrevented) {
    return;
  }

  const root = calendarRoot(control);
  if (root) {
    shiftCalendarVisibleMonth(root, -1);
  }
}

export function handleCalendarHeaderNext(control: HTMLElement, event: Event) {
  if (event.defaultPrevented) {
    return;
  }

  const root = calendarRoot(control);
  if (root) {
    shiftCalendarVisibleMonth(root, 1);
  }
}

function optionElement(select: HTMLElement, event: Event) {
  const target = event.target instanceof Element ? event.target : null;
  const option = target?.closest("[data-calendar-option]");
  return option instanceof HTMLElement && select.contains(option) ? option : null;
}

export function handleCalendarSelectClick(select: HTMLElement, event: Event) {
  if (event.defaultPrevented) {
    return;
  }

  const root = calendarRoot(select);
  if (!root) {
    return;
  }

  const option = optionElement(select, event);
  if (option) {
    const visibleMonth = parseCalendarDate(root.getAttribute("visible-month")) ?? new Date();
    const value = option.getAttribute("data-value");
    if (value == null) {
      return;
    }

    if (select.matches("aria-calendar-month-select")) {
      setCalendarVisibleMonth(root, new Date(visibleMonth.getFullYear(), Number(value), visibleMonth.getDate()));
    } else {
      setCalendarVisibleMonth(root, new Date(Number(value), visibleMonth.getMonth(), visibleMonth.getDate()));
    }

    select.removeAttribute("open");
    syncCalendarTreeFromRoot(root);
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (select.hasAttribute("open")) {
    select.removeAttribute("open");
  } else {
    select.setAttribute("open", "");
  }
  syncCalendarTreeFromRoot(root);
}

export { datePart as calendarDatePart };
