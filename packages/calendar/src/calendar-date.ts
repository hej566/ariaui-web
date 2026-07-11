export const calendarMonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const calendarWeekdayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

export function dateFromParts(year: number, month: number, day: number) {
  return new Date(year, month, day);
}

export function datePart(value: Date | string | null | undefined) {
  const date = value instanceof Date ? value : parseCalendarDate(value);
  if (!date) {
    return null;
  }

  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

export function parseCalendarDate(value: Date | string | null | undefined) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return dateFromParts(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (typeof value !== "string") {
    return null;
  }

  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = dateFromParts(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

export function calendarDatesFromAttribute(value: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => parseCalendarDate(entry.trim()))
    .filter((entry): entry is Date => Boolean(entry));
}

export function uniqueCalendarDates(values: readonly Date[]) {
  const seen = new Set<string>();
  const next: Date[] = [];

  for (const value of values) {
    const serialized = datePart(value);
    if (!serialized || seen.has(serialized)) {
      continue;
    }

    seen.add(serialized);
    next.push(value);
  }

  return next;
}

export function serializeCalendarDates(values: readonly Date[]) {
  return uniqueCalendarDates(values)
    .map((value) => datePart(value))
    .filter((value): value is string => Boolean(value))
    .join(",");
}

export function compareCalendarDates(left: Date, right: Date) {
  return dateFromParts(left.getFullYear(), left.getMonth(), left.getDate()).getTime()
    - dateFromParts(right.getFullYear(), right.getMonth(), right.getDate()).getTime();
}

export function isSameCalendarDate(left: Date | null, right: Date | null) {
  return Boolean(left && right && compareCalendarDates(left, right) === 0);
}

export function isSameCalendarMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

export function daysInCalendarMonth(year: number, month: number) {
  return dateFromParts(year, month + 1, 0).getDate();
}

export function addCalendarDays(date: Date, amount: number) {
  return dateFromParts(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function addCalendarMonths(date: Date, amount: number) {
  const firstOfTargetMonth = dateFromParts(date.getFullYear(), date.getMonth() + amount, 1);
  const day = Math.min(date.getDate(), daysInCalendarMonth(firstOfTargetMonth.getFullYear(), firstOfTargetMonth.getMonth()));
  return dateFromParts(firstOfTargetMonth.getFullYear(), firstOfTargetMonth.getMonth(), day);
}

export function addCalendarYears(date: Date, amount: number) {
  return addCalendarMonths(date, amount * 12);
}

export function startOfCalendarMonth(date: Date) {
  return dateFromParts(date.getFullYear(), date.getMonth(), 1);
}

export function startOfCalendarWeek(date: Date) {
  return addCalendarDays(date, -date.getDay());
}

export function buildCalendarMonth(visibleMonth: Date) {
  const firstVisibleDate = startOfCalendarWeek(startOfCalendarMonth(visibleMonth));
  const rows: Date[][] = [];

  for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
    const row: Date[] = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      row.push(addCalendarDays(firstVisibleDate, weekIndex * 7 + dayIndex));
    }
    rows.push(row);
  }

  return rows;
}

export function formatCalendarMonth(date: Date) {
  return calendarMonthNames[date.getMonth()] ?? "";
}

export function formatCalendarYear(date: Date) {
  return String(date.getFullYear());
}

export function calendarRangeState(date: Date, selectedDates: readonly Date[]) {
  const dates = uniqueCalendarDates(selectedDates).sort(compareCalendarDates);
  const first = dates[0] ?? null;
  const second = dates[1] ?? null;

  if (!first) {
    return {
      inRange: false,
      rangeEnd: false,
      rangeStart: false,
      selected: false,
    };
  }

  if (!second) {
    const selected = isSameCalendarDate(date, first);
    return {
      inRange: selected,
      rangeEnd: false,
      rangeStart: selected,
      selected,
    };
  }

  const selected = isSameCalendarDate(date, first) || isSameCalendarDate(date, second);
  return {
    inRange: compareCalendarDates(date, first) >= 0 && compareCalendarDates(date, second) <= 0,
    rangeEnd: isSameCalendarDate(date, second),
    rangeStart: isSameCalendarDate(date, first),
    selected,
  };
}

export function resolveCalendarVisibleMonth(root: Element) {
  const visibleMonth = parseCalendarDate(root.getAttribute("visible-month"));
  if (visibleMonth) {
    return visibleMonth;
  }

  const selectedDates = calendarDatesFromAttribute(root.getAttribute("selected-dates") ?? root.getAttribute("value"));
  const selectedDate = selectedDates[0];
  if (selectedDate) {
    return selectedDate;
  }

  const defaultDates = calendarDatesFromAttribute(root.getAttribute("default-dates") ?? root.getAttribute("default-value") ?? root.getAttribute("defaultvalue"));
  const defaultDate = defaultDates[0];
  if (defaultDate) {
    return defaultDate;
  }

  return new Date();
}
