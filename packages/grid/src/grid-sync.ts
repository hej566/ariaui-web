import {
  cellKey,
  gridCellCoordinates,
  gridCells,
  gridHeaders,
  gridRoot,
  gridRootValues,
  gridValuesFromAttribute,
  writeGridRootValue,
} from "./grid-dom";

type GridSyncState = {
  activeCellId: string | null;
  defaultValueApplied: boolean;
  observer: MutationObserver | null;
  syncing: boolean;
};

const gridStates = new WeakMap<Element, GridSyncState>();
let gridCellId = 0;

function gridState(root: Element) {
  let state = gridStates.get(root);

  if (!state) {
    state = {
      activeCellId: null,
      defaultValueApplied: false,
      observer: null,
      syncing: false,
    };
    gridStates.set(root, state);
  }

  return state;
}

export function observeGridTree(root: HTMLElement) {
  const state = gridState(root);
  if (state.observer || typeof MutationObserver === "undefined") {
    return;
  }

  state.observer = new MutationObserver(() => {
    syncGridTreeFromRoot(root);
  });
  state.observer.observe(root, {
    attributeFilter: ["default-value", "role", "value"],
    attributes: true,
    childList: true,
    subtree: true,
  });
}

export function disconnectGridTree(root: HTMLElement) {
  const state = gridState(root);
  state.observer?.disconnect();
  state.observer = null;
}

function rootValues(root: Element, state: GridSyncState) {
  if (!state.defaultValueApplied && !root.hasAttribute("value") && root.hasAttribute("default-value")) {
    writeGridRootValue(root, gridValuesFromAttribute(root.getAttribute("default-value")));
    state.defaultValueApplied = true;
  }

  if (root.hasAttribute("value")) {
    state.defaultValueApplied = true;
  }

  return gridRootValues(root);
}

function ensureCellId(cell: HTMLElement, row: number, col: number) {
  if (!cell.id) {
    gridCellId += 1;
    cell.id = "ariaui-grid-cell-" + gridCellId + "-" + cellKey(row, col).replace(/[^a-zA-Z0-9_-]/g, "-");
  }
}

function syncGridRows(root: Element) {
  for (const row of root.querySelectorAll<HTMLElement>("aria-grid-row, [role='row']")) {
    if (row.closest("aria-grid") !== root) {
      continue;
    }

    if (!row.hasAttribute("role")) {
      row.setAttribute("role", "row");
    }

    if (!row.hasAttribute("selected")) {
      row.removeAttribute("aria-selected");
    }
  }
}

function syncGridHeaders(root: Element) {
  for (const header of gridHeaders(root)) {
    if (!header.hasAttribute("role")) {
      header.setAttribute("role", "columnheader");
    }

    header.removeAttribute("tabindex");
    header.removeAttribute("data-selected");
    header.removeAttribute("data-focused");
  }
}

function findInitialActiveCell(cells: readonly HTMLElement[], selectedValues: readonly string[]) {
  for (const value of selectedValues) {
    const selectedCell = cells.find((cell) => cell.dataset.value === value);
    if (selectedCell) {
      return selectedCell;
    }
  }

  return cells[0] ?? null;
}

export function setGridActiveCell(root: Element, cell: HTMLElement | null) {
  const state = gridState(root);
  state.activeCellId = cell?.id ?? null;
  syncGridTreeFromRoot(root);
}

export function syncGridTreeAround(element: Element) {
  const root = element.matches("aria-grid") ? element : gridRoot(element);
  if (!root) {
    return;
  }

  syncGridTreeFromRoot(root);
}

export function syncGridTreeFromRoot(root: Element) {
  const state = gridState(root);
  if (state.syncing) {
    return;
  }

  state.syncing = true;

  try {
    if (!root.hasAttribute("role")) {
      root.setAttribute("role", "grid");
    }

    syncGridRows(root);
    syncGridHeaders(root);

    const selectedValues = rootValues(root, state);
    const selectedSet = new Set(selectedValues);
    const cells = gridCells(root);

    for (const cell of cells) {
      const coordinates = gridCellCoordinates(cell, root);
      const value = cell.hasAttribute("value") ? cell.getAttribute("value") ?? "" : cell.dataset.value ?? cellKey(coordinates.row, coordinates.col);

      ensureCellId(cell, coordinates.row, coordinates.col);

      if (!cell.hasAttribute("role")) {
        cell.setAttribute("role", "gridcell");
      }

      cell.dataset.row = String(coordinates.row);
      cell.dataset.col = String(coordinates.col);
      cell.dataset.value = value;
    }

    if (state.activeCellId && !cells.some((cell) => cell.id === state.activeCellId)) {
      state.activeCellId = null;
    }

    const activeCell = state.activeCellId
      ? cells.find((cell) => cell.id === state.activeCellId) ?? null
      : findInitialActiveCell(cells, selectedValues);

    state.activeCellId = activeCell?.id ?? null;

    for (const cell of cells) {
      const isFocused = activeCell === cell;
      const isSelected = selectedSet.has(cell.dataset.value ?? "");

      cell.setAttribute("tabindex", isFocused ? "0" : "-1");

      if (isFocused) {
        cell.dataset.focused = "true";
      } else {
        cell.removeAttribute("data-focused");
      }

      if (isSelected) {
        cell.setAttribute("aria-selected", "true");
        cell.dataset.selected = "true";
      } else {
        cell.removeAttribute("aria-selected");
        cell.removeAttribute("data-selected");
      }
    }
  } finally {
    state.syncing = false;
  }
}
