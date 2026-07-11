import { parseCalendarDate } from "./calendar-date";

export function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

export function calendarRoot(element: Element | null) {
  return element?.closest("aria-calendar") as HTMLElement | null;
}

export function elementBelongsToCalendar(element: Element, root: Element) {
  return element.closest("aria-calendar") === root;
}

export function calendarElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => elementBelongsToCalendar(element, root));
}

export function calendarBodies(root: Element) {
  return calendarElements(root, "aria-calendar-body");
}

export function calendarCells(root: Element) {
  return calendarElements(root, "aria-calendar-cell, [role='gridcell']");
}

export function calendarGridForCell(cell: HTMLElement) {
  return cell.closest("aria-calendar-body, [role='grid']") as HTMLElement | null;
}

export function calendarRowsInGrid(grid: Element) {
  return Array.from(grid.querySelectorAll<HTMLElement>("aria-calendar-row, [role='row']")).filter((row) => {
    const ownerGrid = row.closest("aria-calendar-body, [role='grid']");
    return ownerGrid === grid;
  });
}

export function calendarCellsInRow(row: Element, grid: Element) {
  return Array.from(row.children).filter((child): child is HTMLElement => {
    return child instanceof HTMLElement
      && (child.matches("aria-calendar-cell") || child.getAttribute("role") === "gridcell")
      && calendarGridForCell(child) === grid;
  });
}

export function calendarCellDate(cell: Element) {
  return parseCalendarDate(cell.getAttribute("date") ?? cell.getAttribute("data-date") ?? cell.getAttribute("value"));
}

export function calendarCellCoordinates(cell: HTMLElement) {
  const grid = calendarGridForCell(cell);
  if (!grid) {
    return {
      col: Number(cell.dataset.col) || 0,
      row: Number(cell.dataset.row) || 0,
    };
  }

  const rows = calendarRowsInGrid(grid);
  for (const [rowIndex, row] of rows.entries()) {
    const cells = calendarCellsInRow(row, grid);
    const colIndex = cells.indexOf(cell);
    if (colIndex !== -1) {
      return {
        col: colIndex,
        row: rowIndex,
      };
    }
  }

  return {
    col: Number(cell.dataset.col) || 0,
    row: Number(cell.dataset.row) || 0,
  };
}

export function calendarPartSlot(partName: string) {
  switch (partName) {
    case "Root":
      return "calendar-root";
    case "Header":
      return "calendar-header";
    case "HeaderPrevious":
      return "calendar-header-previous";
    case "HeaderMonth":
      return "calendar-header-month";
    case "HeaderYear":
      return "calendar-header-year";
    case "HeaderNext":
      return "calendar-header-next";
    case "Body":
      return "calendar-body";
    case "Head":
      return "calendar-head";
    case "Row":
      return "calendar-row";
    case "DayHeader":
      return "calendar-day-header";
    case "Rows":
      return "calendar-rows";
    case "Cell":
      return "calendar-cell";
    case "MonthSelect":
      return "calendar-month-select";
    case "YearSelect":
      return "calendar-year-select";
    default:
      return "calendar-" + partName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }
}
