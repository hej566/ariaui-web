import {
  gridCellCoordinates,
  gridCells,
  gridCellValue,
  gridDataRows,
  gridRoot,
  gridRootValues,
  uniqueGridValues,
  writeGridRootValue,
} from "./grid-dom";
import { setGridActiveCell, syncGridTreeFromRoot } from "./grid-sync";

function isSpaceKey(event: KeyboardEvent) {
  return event.key === " " || event.key === "Space" || event.key === "Spacebar";
}

function dispatchGridValueChange(root: Element, values: readonly string[]) {
  const value = [...values];
  root.dispatchEvent(new CustomEvent("valuechange", {
    bubbles: true,
    detail: {
      value,
      values: value,
    },
  }));
}

function setGridValues(root: Element, values: readonly string[]) {
  const nextValues = uniqueGridValues(values);
  writeGridRootValue(root, nextValues);
  syncGridTreeFromRoot(root);
  dispatchGridValueChange(root, nextValues);
}

function toggleGridValue(root: Element, value: string) {
  const values = gridRootValues(root);
  setGridValues(root, values.includes(value) ? values.filter((candidate) => candidate !== value) : [...values, value]);
}

function toggleGridGroup(root: Element, values: readonly string[]) {
  const currentValues = gridRootValues(root);
  const groupValues = uniqueGridValues(values);
  if (groupValues.length === 0) {
    return;
  }

  const groupSet = new Set(groupValues);
  const groupSelected = groupValues.every((value) => currentValues.includes(value));
  const nextValues = groupSelected
    ? currentValues.filter((value) => !groupSet.has(value))
    : uniqueGridValues([...currentValues, ...groupValues]);

  setGridValues(root, nextValues);
}

function focusGridCell(root: Element, cell: HTMLElement | null) {
  if (!cell) {
    return;
  }

  setGridActiveCell(root, cell);
  cell.focus();
}

function nextGridCell(cell: HTMLElement, key: string, ctrlKey = false) {
  const root = gridRoot(cell);
  if (!root) {
    return null;
  }

  const rows = gridDataRows(root);
  const coordinates = gridCellCoordinates(cell, root);
  const currentRow = rows[coordinates.row] ?? null;
  const currentCells = currentRow ? Array.from(currentRow.children).filter((child): child is HTMLElement => child instanceof HTMLElement && (child.matches("aria-grid-cell") || child.getAttribute("role") === "gridcell")) : [];

  if (ctrlKey && key === "Home") {
    return gridCells(root)[0] ?? null;
  }

  if (ctrlKey && key === "End") {
    const cells = gridCells(root);
    return cells[cells.length - 1] ?? null;
  }

  switch (key) {
    case "ArrowRight":
      return currentCells[coordinates.col + 1] ?? null;
    case "ArrowLeft":
      return currentCells[coordinates.col - 1] ?? null;
    case "ArrowDown": {
      const nextRow = rows[coordinates.row + 1] ?? null;
      return nextRow ? Array.from(nextRow.children).filter((child): child is HTMLElement => child instanceof HTMLElement && (child.matches("aria-grid-cell") || child.getAttribute("role") === "gridcell"))[coordinates.col] ?? null : null;
    }
    case "ArrowUp": {
      const previousRow = rows[coordinates.row - 1] ?? null;
      return previousRow ? Array.from(previousRow.children).filter((child): child is HTMLElement => child instanceof HTMLElement && (child.matches("aria-grid-cell") || child.getAttribute("role") === "gridcell"))[coordinates.col] ?? null : null;
    }
    case "Home":
      return currentCells[0] ?? null;
    case "End":
      return currentCells[currentCells.length - 1] ?? null;
    default:
      return null;
  }
}

export function selectGridCell(cell: HTMLElement) {
  const root = gridRoot(cell);
  if (!root) {
    return;
  }

  focusGridCell(root, cell);
  setGridValues(root, [gridCellValue(cell, root)]);
}

export function handleGridCellFocus(cell: HTMLElement) {
  const root = gridRoot(cell);
  if (!root) {
    return;
  }

  setGridActiveCell(root, cell);
}

export function handleGridCellClick(cell: HTMLElement, event: Event) {
  if (event.defaultPrevented) {
    return;
  }

  selectGridCell(cell);
}

export function handleGridCellKeyDown(cell: HTMLElement, event: KeyboardEvent) {
  if (event.defaultPrevented) {
    return;
  }

  const root = gridRoot(cell);
  if (!root) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    setGridValues(root, []);
    return;
  }

  if (isSpaceKey(event) && event.ctrlKey) {
    event.preventDefault();
    const coordinates = gridCellCoordinates(cell, root);
    const values = gridDataRows(root)
      .map((row) => Array.from(row.children).filter((child): child is HTMLElement => child instanceof HTMLElement && (child.matches("aria-grid-cell") || child.getAttribute("role") === "gridcell"))[coordinates.col])
      .filter((candidate): candidate is HTMLElement => Boolean(candidate))
      .map((candidate) => gridCellValue(candidate, root));
    toggleGridGroup(root, values);
    return;
  }

  if (isSpaceKey(event) && event.shiftKey) {
    event.preventDefault();
    const coordinates = gridCellCoordinates(cell, root);
    const row = gridDataRows(root)[coordinates.row] ?? null;
    const values = row
      ? Array.from(row.children)
          .filter((child): child is HTMLElement => child instanceof HTMLElement && (child.matches("aria-grid-cell") || child.getAttribute("role") === "gridcell"))
          .map((candidate) => gridCellValue(candidate, root))
      : [];
    toggleGridGroup(root, values);
    return;
  }

  if ((event.key === "a" || event.key === "A") && event.ctrlKey) {
    event.preventDefault();
    setGridValues(root, gridCells(root).map((candidate) => gridCellValue(candidate, root)));
    return;
  }

  if (event.key === "Enter" || isSpaceKey(event)) {
    event.preventDefault();
    toggleGridValue(root, gridCellValue(cell, root));
    return;
  }

  if (event.shiftKey && /^Arrow(?:Right|Left|Down|Up)$/.test(event.key)) {
    const target = nextGridCell(cell, event.key);
    if (!target) {
      return;
    }

    event.preventDefault();
    focusGridCell(root, target);
    toggleGridValue(root, gridCellValue(target, root));
    return;
  }

  const target = nextGridCell(cell, event.key, event.ctrlKey);
  if (!target) {
    return;
  }

  event.preventDefault();
  focusGridCell(root, target);
}
