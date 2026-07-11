import {
  addCalendarMonths,
  buildCalendarMonth,
  calendarDatesFromAttribute,
  calendarMonthNames,
  calendarRangeState,
  calendarWeekdayNames,
  datePart,
  formatCalendarMonth,
  formatCalendarYear,
  isSameCalendarDate,
  isSameCalendarMonth,
  parseCalendarDate,
  resolveCalendarVisibleMonth,
  serializeCalendarDates,
  uniqueCalendarDates,
} from "./calendar-date";
import {
  calendarBodies,
  calendarCellDate,
  calendarCells,
  calendarCellsInRow,
  calendarElements,
  calendarPartSlot,
  calendarRoot,
  calendarRowsInGrid,
} from "./calendar-dom";

type CalendarSyncState = {
  defaultDatesApplied: boolean;
  observer: MutationObserver | null;
  pendingFocusDate: string | null;
  syncing: boolean;
};

const calendarStates = new WeakMap<Element, CalendarSyncState>();

function calendarState(root: Element) {
  let state = calendarStates.get(root);

  if (!state) {
    state = {
      defaultDatesApplied: false,
      observer: null,
      pendingFocusDate: null,
      syncing: false,
    };
    calendarStates.set(root, state);
  }

  return state;
}

function setAttributeValue(element: Element, attribute: string, value: string) {
  if (element.getAttribute(attribute) !== value) {
    element.setAttribute(attribute, value);
  }
}

function removeAttributeValue(element: Element, attribute: string) {
  if (element.hasAttribute(attribute)) {
    element.removeAttribute(attribute);
  }
}

function setBooleanDataAttribute(element: Element, attribute: string, value: boolean) {
  if (value) {
    setAttributeValue(element, attribute, "true");
  } else {
    removeAttributeValue(element, attribute);
  }
}

function rootDefaultDates(root: Element) {
  return calendarDatesFromAttribute(root.getAttribute("default-dates") ?? root.getAttribute("default-value") ?? root.getAttribute("defaultvalue"));
}

export function calendarRootMode(root: Element) {
  const mode = root.getAttribute("mode");
  return mode === "range" || mode === "dual-range" ? mode : "single";
}

export function calendarRootSelectedDates(root: Element) {
  if (root.hasAttribute("selected-dates")) {
    return uniqueCalendarDates(calendarDatesFromAttribute(root.getAttribute("selected-dates")));
  }

  return uniqueCalendarDates(calendarDatesFromAttribute(root.getAttribute("value")));
}

function applyDefaultDates(root: Element, state: CalendarSyncState) {
  if (state.defaultDatesApplied) {
    return;
  }

  if (root.hasAttribute("value") || root.hasAttribute("selected-dates")) {
    state.defaultDatesApplied = true;
    return;
  }

  const defaultDates = rootDefaultDates(root);
  if (defaultDates.length > 0) {
    setAttributeValue(root, "value", serializeCalendarDates(defaultDates));
    state.defaultDatesApplied = true;
  }
}

function ensureVisibleMonth(root: Element) {
  if (!root.hasAttribute("visible-month")) {
    const visibleMonth = resolveCalendarVisibleMonth(root);
    const serialized = datePart(visibleMonth);
    if (serialized) {
      setAttributeValue(root, "visible-month", serialized);
    }
  }
}

export function observeCalendarTree(root: HTMLElement) {
  const state = calendarState(root);
  if (state.observer || typeof MutationObserver === "undefined") {
    return;
  }

  state.observer = new MutationObserver(() => {
    syncCalendarTreeFromRoot(root);
  });
  state.observer.observe(root, {
    attributeFilter: [
      "date",
      "default-dates",
      "default-value",
      "defaultvalue",
      "disabled",
      "mode",
      "open",
      "outside-month",
      "role",
      "selected-dates",
      "value",
      "visible-month",
    ],
    attributes: true,
    childList: true,
    subtree: true,
  });
}

export function disconnectCalendarTree(root: HTMLElement) {
  const state = calendarState(root);
  state.observer?.disconnect();
  state.observer = null;
}

export function setCalendarSelectedDates(root: Element, dates: readonly Date[]) {
  setAttributeValue(root, "value", serializeCalendarDates(dates));
  syncCalendarTreeFromRoot(root);

  const selectedDates = calendarRootSelectedDates(root);
  root.dispatchEvent(new CustomEvent("valuechange", {
    bubbles: true,
    detail: {
      dates: selectedDates,
      value: selectedDates,
      values: selectedDates.map((date) => datePart(date)).filter((value): value is string => Boolean(value)),
    },
  }));
}

export function setCalendarVisibleMonth(root: Element, date: Date) {
  const serialized = datePart(date);
  if (!serialized) {
    return;
  }

  const previous = root.getAttribute("visible-month");
  setAttributeValue(root, "visible-month", serialized);
  syncCalendarTreeFromRoot(root);

  if (previous !== serialized) {
    root.dispatchEvent(new CustomEvent("visiblemonthchange", {
      bubbles: true,
      detail: {
        value: date,
        visibleMonth: date,
      },
    }));
  }
}

export function shiftCalendarVisibleMonth(root: Element, amount: number) {
  setCalendarVisibleMonth(root, addCalendarMonths(resolveCalendarVisibleMonth(root), amount));
}

function syncCalendarPartSlots(root: Element) {
  const selector = [
    "aria-calendar",
    "aria-calendar-header",
    "aria-calendar-header-previous",
    "aria-calendar-header-month",
    "aria-calendar-header-year",
    "aria-calendar-header-next",
    "aria-calendar-body",
    "aria-calendar-head",
    "aria-calendar-row",
    "aria-calendar-day-header",
    "aria-calendar-rows",
    "aria-calendar-cell",
    "aria-calendar-month-select",
    "aria-calendar-year-select",
  ].join(",");

  const parts = [root, ...calendarElements(root, selector)];
  for (const part of parts) {
    const partName = part.getAttribute("data-part");
    if (!partName) {
      continue;
    }
    setAttributeValue(part, "data-slot", calendarPartSlot(partName));
  }
}

function renderDefaultHeader(header: HTMLElement) {
  if (header.children.length > 0) {
    return;
  }

  const previous = document.createElement("aria-calendar-header-previous");
  const month = document.createElement("aria-calendar-header-month");
  const year = document.createElement("aria-calendar-header-year");
  const next = document.createElement("aria-calendar-header-next");

  previous.textContent = "‹";
  next.textContent = "›";
  header.append(previous, month, year, next);
}

function syncCalendarHeaders(root: Element, visibleMonth: Date) {
  for (const header of calendarElements(root, "aria-calendar-header")) {
    renderDefaultHeader(header);
  }

  for (const previous of calendarElements(root, "aria-calendar-header-previous")) {
    setAttributeValue(previous, "aria-label", previous.getAttribute("aria-label") ?? "Previous month");
    if (!previous.textContent?.trim()) {
      previous.textContent = "‹";
    }
  }

  for (const next of calendarElements(root, "aria-calendar-header-next")) {
    setAttributeValue(next, "aria-label", next.getAttribute("aria-label") ?? "Next month");
    if (!next.textContent?.trim()) {
      next.textContent = "›";
    }
  }

  for (const month of calendarElements(root, "aria-calendar-header-month")) {
    const label = formatCalendarMonth(visibleMonth);
    if (month.textContent !== label) {
      month.textContent = label;
    }
  }

  for (const year of calendarElements(root, "aria-calendar-header-year")) {
    const label = formatCalendarYear(visibleMonth);
    if (year.textContent !== label) {
      year.textContent = label;
    }
  }
}

function selectOption(document: Document, label: string, value: string, selected: boolean) {
  const option = document.createElement("div");
  option.setAttribute("role", "option");
  option.setAttribute("tabindex", "-1");
  option.setAttribute("data-calendar-option", "");
  option.setAttribute("data-value", value);
  option.setAttribute("aria-selected", String(selected));
  option.textContent = label;
  return option;
}

function renderCalendarSelect(select: HTMLElement, visibleMonth: Date, type: "month" | "year") {
  const renderKey = type + ":" + (datePart(visibleMonth) ?? "") + ":" + String(select.hasAttribute("open"));
  if (select.getAttribute("data-calendar-rendered-select") === renderKey && select.querySelector("[data-calendar-generated-select='true']")) {
    return;
  }

  for (const generated of Array.from(select.querySelectorAll("[data-calendar-generated-select='true']"))) {
    generated.remove();
  }

  setAttributeValue(select, "data-calendar-rendered-select", renderKey);

  const label = document.createElement("span");
  label.setAttribute("data-calendar-generated-select", "true");
  label.setAttribute("data-calendar-select-label", "");
  label.textContent = type === "month" ? formatCalendarMonth(visibleMonth) : formatCalendarYear(visibleMonth);

  const list = document.createElement("div");
  list.setAttribute("data-calendar-generated-select", "true");
  list.setAttribute("role", "listbox");
  list.hidden = !select.hasAttribute("open");

  if (type === "month") {
    calendarMonthNames.forEach((monthName, index) => {
      list.append(selectOption(document, monthName, String(index), index === visibleMonth.getMonth()));
    });
  } else {
    const currentYear = visibleMonth.getFullYear();
    for (let year = currentYear - 5; year <= currentYear + 6; year += 1) {
      list.append(selectOption(document, String(year), String(year), year === currentYear));
    }
  }

  select.append(label, list);
}

function syncCalendarSelects(root: Element, visibleMonth: Date) {
  for (const monthSelect of calendarElements(root, "aria-calendar-month-select")) {
    setAttributeValue(monthSelect, "aria-haspopup", "listbox");
    setAttributeValue(monthSelect, "aria-expanded", String(monthSelect.hasAttribute("open")));
    renderCalendarSelect(monthSelect, visibleMonth, "month");
  }

  for (const yearSelect of calendarElements(root, "aria-calendar-year-select")) {
    setAttributeValue(yearSelect, "aria-haspopup", "listbox");
    setAttributeValue(yearSelect, "aria-expanded", String(yearSelect.hasAttribute("open")));
    renderCalendarSelect(yearSelect, visibleMonth, "year");
  }
}

function renderDayHeaders(head: HTMLElement) {
  head.replaceChildren();

  for (const weekday of calendarWeekdayNames) {
    const dayHeader = document.createElement("aria-calendar-day-header");
    dayHeader.textContent = weekday;
    head.append(dayHeader);
  }
}

function renderCalendarGrid(body: HTMLElement, visibleMonth: Date) {
  const renderedMonth = datePart(visibleMonth) ?? "";
  const shouldRender = body.getAttribute("data-calendar-rendered-month") !== renderedMonth
    || body.querySelector("aria-calendar-cell") === null;

  if (!shouldRender) {
    return;
  }

  body.replaceChildren();
  setAttributeValue(body, "data-calendar-rendered-month", renderedMonth);
  setAttributeValue(body, "data-calendar-generated", "true");

  const head = document.createElement("aria-calendar-head");
  const rows = document.createElement("aria-calendar-rows");
  renderDayHeaders(head);

  buildCalendarMonth(visibleMonth).forEach((week, rowIndex) => {
    const row = document.createElement("aria-calendar-row");
    week.forEach((date, colIndex) => {
      const cell = document.createElement("aria-calendar-cell");
      const serialized = datePart(date) ?? "";
      cell.setAttribute("date", serialized);
      cell.setAttribute("data-row", String(rowIndex));
      cell.setAttribute("data-col", String(colIndex));
      if (!isSameCalendarMonth(date, visibleMonth)) {
        cell.setAttribute("outside-month", "");
      }

      const inner = document.createElement("div");
      inner.setAttribute("data-slot", "calendar-cell-inner");
      inner.textContent = String(date.getDate());
      cell.append(inner);
      row.append(cell);
    });
    rows.append(row);
  });

  body.append(head, rows);
}

function renderDualCalendarBody(body: HTMLElement, visibleMonth: Date) {
  const renderedMonth = datePart(visibleMonth) ?? "";
  const shouldRender = body.getAttribute("data-calendar-rendered-month") !== renderedMonth
    || body.querySelector("aria-calendar-body[data-calendar-pane-grid='true']") === null;

  if (!shouldRender) {
    return;
  }

  body.replaceChildren();
  setAttributeValue(body, "data-calendar-rendered-month", renderedMonth);
  setAttributeValue(body, "data-calendar-dual-container", "true");
  removeAttributeValue(body, "role");

  for (let paneIndex = 0; paneIndex < 2; paneIndex += 1) {
    const paneMonth = addCalendarMonths(visibleMonth, paneIndex);
    const pane = document.createElement("div");
    pane.setAttribute("data-slot", "calendar-pane");

    const header = document.createElement("div");
    header.setAttribute("data-slot", "calendar-pane-header");
    const title = document.createElement("span");
    title.textContent = formatCalendarMonth(paneMonth) + " " + formatCalendarYear(paneMonth);

    if (paneIndex === 0) {
      const previous = document.createElement("aria-calendar-header-previous");
      previous.textContent = "‹";
      header.append(previous);
    }

    header.append(title);

    if (paneIndex === 1) {
      const next = document.createElement("aria-calendar-header-next");
      next.textContent = "›";
      header.append(next);
    }

    const grid = document.createElement("aria-calendar-body");
    grid.setAttribute("data-calendar-pane", String(paneIndex));
    grid.setAttribute("data-calendar-pane-grid", "true");
    renderCalendarGrid(grid, paneMonth);

    pane.append(header, grid);
    body.append(pane);
  }
}

function syncCalendarDayHeaders(grid: Element) {
  for (const dayHeader of Array.from(grid.querySelectorAll<HTMLElement>("aria-calendar-day-header"))) {
    const ownerGrid = dayHeader.closest("aria-calendar-body, [role='grid']");
    if (ownerGrid !== grid) {
      continue;
    }

    if (!dayHeader.hasAttribute("role")) {
      dayHeader.setAttribute("role", "columnheader");
    }
    dayHeader.removeAttribute("tabindex");
    setAttributeValue(dayHeader, "data-slot", "calendar-day-header");
  }
}

function findFocusableCalendarDate(cells: readonly HTMLElement[], selectedDates: readonly Date[], visibleMonth: Date) {
  for (const selectedDate of selectedDates) {
    const selectedCell = cells.find((cell) => {
      const cellDate = calendarCellDate(cell);
      return cellDate && isSameCalendarDate(cellDate, selectedDate) && cell.getAttribute("aria-disabled") !== "true";
    });

    if (selectedCell) {
      return calendarCellDate(selectedCell);
    }
  }

  const firstInMonthCell = cells.find((cell) => {
    const cellDate = calendarCellDate(cell);
    return cellDate && isSameCalendarMonth(cellDate, visibleMonth) && cell.getAttribute("aria-disabled") !== "true";
  });

  return firstInMonthCell ? calendarCellDate(firstInMonthCell) : null;
}

function syncCalendarCell(cell: HTMLElement, visibleMonth: Date, selectedDates: readonly Date[], rowIndex: number, colIndex: number, focusableDate: Date | null) {
  const cellDate = calendarCellDate(cell);
  if (!cellDate) {
    return;
  }

  const serialized = datePart(cellDate) ?? "";
  const outsideMonth = cell.hasAttribute("outside-month") || cell.getAttribute("data-outside-month") === "true" || !isSameCalendarMonth(cellDate, visibleMonth);
  const ownDisabled = cell.hasAttribute("disabled");
  const disabled = ownDisabled || outsideMonth;
  const rangeState = outsideMonth ? {
    inRange: false,
    rangeEnd: false,
    rangeStart: false,
    selected: false,
  } : calendarRangeState(cellDate, selectedDates);
  let inner = cell.querySelector<HTMLElement>("[data-slot='calendar-cell-inner']");

  if (!inner) {
    inner = document.createElement("div");
    inner.setAttribute("data-slot", "calendar-cell-inner");
    inner.textContent = String(cellDate.getDate());
    cell.append(inner);
  }

  setAttributeValue(cell, "role", "gridcell");
  setAttributeValue(cell, "data-slot", "calendar-cell");
  setAttributeValue(cell, "data-date", serialized);
  setAttributeValue(cell, "data-row", String(rowIndex));
  setAttributeValue(cell, "data-col", String(colIndex));
  setAttributeValue(cell, "tabindex", focusableDate && isSameCalendarDate(cellDate, focusableDate) && !disabled ? "0" : "-1");
  setAttributeValue(inner, "data-slot", "calendar-cell-inner");

  if (!inner.textContent?.trim()) {
    inner.textContent = String(cellDate.getDate());
  }

  if (disabled) {
    setAttributeValue(cell, "aria-disabled", "true");
  } else if (!ownDisabled) {
    removeAttributeValue(cell, "aria-disabled");
  }

  setBooleanDataAttribute(cell, "data-disabled", disabled);
  setBooleanDataAttribute(cell, "data-outside-month", outsideMonth);
  setBooleanDataAttribute(cell, "data-selected", rangeState.selected);
  setBooleanDataAttribute(cell, "data-today", isSameCalendarDate(cellDate, new Date()));
  setBooleanDataAttribute(cell, "data-week-start", colIndex === 0);
  setBooleanDataAttribute(cell, "data-week-end", colIndex === 6);
  setBooleanDataAttribute(cell, "data-range-start", rangeState.rangeStart);
  setBooleanDataAttribute(cell, "data-range-end", rangeState.rangeEnd);
  setBooleanDataAttribute(cell, "data-in-range", rangeState.inRange);

  setBooleanDataAttribute(inner, "data-disabled", disabled);
  setBooleanDataAttribute(inner, "data-outside-month", outsideMonth);
  setBooleanDataAttribute(inner, "data-selected", rangeState.selected);
  setBooleanDataAttribute(inner, "data-today", isSameCalendarDate(cellDate, new Date()));
  setBooleanDataAttribute(inner, "data-week-start", colIndex === 0);
  setBooleanDataAttribute(inner, "data-week-end", colIndex === 6);
  setBooleanDataAttribute(inner, "data-range-start", rangeState.rangeStart);
  setBooleanDataAttribute(inner, "data-range-end", rangeState.rangeEnd);
  setBooleanDataAttribute(inner, "data-in-range", rangeState.inRange);

  if (rangeState.selected) {
    setAttributeValue(cell, "aria-selected", "true");
  } else {
    removeAttributeValue(cell, "aria-selected");
  }
}

function syncCalendarGrid(root: Element, grid: HTMLElement, visibleMonth: Date, selectedDates: readonly Date[]) {
  if (!grid.hasAttribute("role")) {
    setAttributeValue(grid, "role", "grid");
  }

  setAttributeValue(grid, "data-slot", "calendar-body");
  syncCalendarDayHeaders(grid);

  const rows = calendarRowsInGrid(grid);
  const cells = rows.flatMap((row) => calendarCellsInRow(row, grid));
  const focusableDate = findFocusableCalendarDate(cells, selectedDates, visibleMonth);

  rows.forEach((row, rowIndex) => {
    setAttributeValue(row, "role", "row");
    setAttributeValue(row, "data-slot", "calendar-row");
    removeAttributeValue(row, "aria-selected");

    calendarCellsInRow(row, grid).forEach((cell, colIndex) => {
      syncCalendarCell(cell, visibleMonth, selectedDates, rowIndex, colIndex, focusableDate);
    });
  });

  if (calendarState(root).pendingFocusDate) {
    const pendingFocusDate = parseCalendarDate(calendarState(root).pendingFocusDate);
    const targetCell = pendingFocusDate
      ? cells.find((cell) => {
          const cellDate = calendarCellDate(cell);
          return Boolean(cellDate && isSameCalendarDate(cellDate, pendingFocusDate) && cell.getAttribute("aria-disabled") !== "true");
        })
      : null;

    if (targetCell) {
      calendarState(root).pendingFocusDate = null;
      targetCell.focus();
    }
  }
}

function syncCalendarBody(root: Element, body: HTMLElement, visibleMonth: Date, selectedDates: readonly Date[]) {
  const mode = calendarRootMode(root);

  if (mode === "dual-range" && !body.hasAttribute("data-calendar-pane-grid")) {
    renderDualCalendarBody(body, visibleMonth);
    removeAttributeValue(body, "role");
    for (const paneGrid of Array.from(body.querySelectorAll<HTMLElement>("aria-calendar-body[data-calendar-pane-grid='true']"))) {
      syncCalendarBody(root, paneGrid, visibleMonth, selectedDates);
    }
    return;
  }

  const paneIndex = Number(body.getAttribute("data-calendar-pane") ?? "0");
  const gridMonth = body.hasAttribute("data-calendar-pane-grid")
    ? addCalendarMonths(visibleMonth, Number.isFinite(paneIndex) ? paneIndex : 0)
    : visibleMonth;
  const shouldAutoRender = body.hasAttribute("data-calendar-generated") || body.querySelector("aria-calendar-cell") === null;

  if (shouldAutoRender) {
    renderCalendarGrid(body, gridMonth);
  }

  syncCalendarGrid(root, body, gridMonth, selectedDates);
}

export function syncCalendarTreeAround(element: Element) {
  const root = element.matches("aria-calendar") ? element : calendarRoot(element);
  if (!root) {
    return;
  }

  syncCalendarTreeFromRoot(root);
}

export function syncCalendarTreeFromRoot(root: Element) {
  const state = calendarState(root);
  if (state.syncing) {
    return;
  }

  state.syncing = true;

  try {
    applyDefaultDates(root, state);
    ensureVisibleMonth(root);
    const visibleMonth = resolveCalendarVisibleMonth(root);
    const selectedDates = calendarRootSelectedDates(root);

    syncCalendarPartSlots(root);
    syncCalendarHeaders(root, visibleMonth);
    syncCalendarSelects(root, visibleMonth);

    for (const body of calendarBodies(root)) {
      syncCalendarBody(root, body, visibleMonth, selectedDates);
    }

    for (const cell of calendarCells(root)) {
      if (!cell.closest("aria-calendar-body, [role='grid']")) {
        syncCalendarCell(cell, visibleMonth, selectedDates, 0, 0, selectedDates[0] ?? null);
      }
    }
  } finally {
    state.syncing = false;
  }
}

export function focusCalendarDate(root: Element, date: Date) {
  const serialized = datePart(date);
  if (!serialized) {
    return;
  }

  calendarState(root).pendingFocusDate = serialized;
  setCalendarVisibleMonth(root, date);
  syncCalendarTreeFromRoot(root);
}
