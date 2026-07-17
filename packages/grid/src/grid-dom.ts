export function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

export function cellKey(row: number, col: number) {
  return row + ":" + col;
}

export function gridRoot(element: Element | null) {
  return element?.closest("aria-grid") as HTMLElement | null;
}

export function gridCompositionHost(part: HTMLElement) {
  if (!part.hasAttribute("native-composition")) {
    return part;
  }

  return Array.from(part.children).find((child): child is HTMLElement => child instanceof HTMLElement) ?? part;
}

export function gridRowHost(row: HTMLElement) {
  return row.matches("aria-grid-row") ? gridCompositionHost(row) : row;
}

export function gridCellHost(cell: HTMLElement) {
  return cell.matches("aria-grid-cell") ? gridCompositionHost(cell) : cell;
}

export function gridRowSource(row: HTMLElement) {
  return row.matches("aria-grid-row") ? row : row.closest<HTMLElement>("aria-grid-row[native-composition]") ?? row;
}

export function gridCellSource(cell: HTMLElement) {
  return cell.matches("aria-grid-cell") ? cell : cell.closest<HTMLElement>("aria-grid-cell[native-composition]") ?? cell;
}

export function elementBelongsToGrid(element: Element, root: Element) {
  return element.closest("aria-grid") === root;
}

export function isGridCell(element: Element, root: Element) {
  return elementBelongsToGrid(element, root)
    && (element.matches("aria-grid-cell") || element.getAttribute("role") === "gridcell" || gridCellSource(element as HTMLElement).matches("aria-grid-cell"));
}

export function gridRows(root: Element) {
  const rows = Array.from(root.querySelectorAll<HTMLElement>("aria-grid-row, [role='row']"))
    .filter((row) => elementBelongsToGrid(row, root))
    .filter((row) => row.matches("aria-grid-row") || !row.closest("aria-grid-row[native-composition]"))
    .map(gridRowHost);

  return Array.from(new Set(rows));
}

export function gridCellsInRow(row: Element, root: Element) {
  return Array.from(row.children)
    .filter((child): child is HTMLElement => child instanceof HTMLElement)
    .map(gridCellHost)
    .filter((child) => isGridCell(child, root));
}

export function gridDataRows(root: Element) {
  return gridRows(root).filter((row) => gridCellsInRow(row, root).length > 0);
}

export function gridCells(root: Element) {
  return gridDataRows(root).flatMap((row) => gridCellsInRow(row, root));
}

export function gridHeaders(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-grid-header, [role='columnheader']")).filter((header) => elementBelongsToGrid(header, root));
}

export function gridCellCoordinates(cell: HTMLElement, root: Element) {
  const rows = gridDataRows(root);
  for (const [rowIndex, row] of rows.entries()) {
    const cells = gridCellsInRow(row, root);
    const colIndex = cells.indexOf(cell);
    if (colIndex !== -1) {
      return { row: rowIndex, col: colIndex };
    }
  }

  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  return {
    row: Number.isFinite(row) ? row : 0,
    col: Number.isFinite(col) ? col : 0,
  };
}

export function gridCellValue(cell: HTMLElement, root?: Element) {
  const source = gridCellSource(cell);
  if (source.hasAttribute("value")) {
    return source.getAttribute("value") ?? "";
  }

  if (cell.dataset.value) {
    return cell.dataset.value;
  }

  if (!source.matches("aria-grid-cell")) {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    if (Number.isFinite(row) && Number.isFinite(col)) {
      return cellKey(row, col);
    }
  }

  const ownerRoot = root ?? gridRoot(cell);
  const coordinates = ownerRoot ? gridCellCoordinates(cell, ownerRoot) : {
    row: Number(cell.dataset.row) || 0,
    col: Number(cell.dataset.col) || 0,
  };
  return cellKey(coordinates.row, coordinates.col);
}

export function gridValuesFromAttribute(value: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function uniqueGridValues(values: readonly string[]) {
  const seen = new Set<string>();
  const next: string[] = [];

  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      next.push(value);
    }
  }

  return next;
}

export function writeGridRootValue(root: Element, values: readonly string[]) {
  root.setAttribute("value", uniqueGridValues(values).join(","));
}

export function gridRootValues(root: Element) {
  return uniqueGridValues(gridValuesFromAttribute(root.getAttribute("value")));
}
