import {
  cellKey,
  gridCellCoordinates,
  gridCellSource,
  gridCells,
  gridHeaders,
  gridRoot,
  gridRootValues,
  gridValuesFromAttribute,
  writeGridRootValue,
} from "./grid-dom";

type GridSyncState = {
  activeCellId: string | null;
  controlled: boolean;
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
      controlled: root.hasAttribute("value"),
      defaultValueApplied: false,
      observer: null,
      syncing: false,
    };
    gridStates.set(root, state);
  }

  return state;
}

export function gridRootIsControlled(root: Element) {
  return gridState(root).controlled;
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

const composedAttributes = new Set(["part", "role", "tabindex", "title", "value"]);
type GridCompositionState = {
  baseAttributes: Map<string, string>;
  baseClasses: Set<string>;
  baseStyles: Map<string, { priority: string; value: string }>;
  forwardedAttributes: Set<string>;
  forwardedClasses: Set<string>;
  forwardedStyles: Set<string>;
  host: HTMLElement;
};

const gridCompositionStates = new WeakMap<HTMLElement, GridCompositionState>();
const generatedCellCoordinates = new WeakMap<HTMLElement, { col: number | null; row: number | null }>();
const generatedCellValues = new WeakMap<HTMLElement, string>();
const resolvedCellCoordinates = new WeakMap<HTMLElement, string>();

function compositionState(source: HTMLElement, host: HTMLElement) {
  const current = gridCompositionStates.get(source);
  if (current?.host === host) {
    return current;
  }

  const state: GridCompositionState = {
    baseAttributes: new Map(Array.from(host.attributes, (attribute) => [attribute.name, attribute.value])),
    baseClasses: new Set(host.classList),
    baseStyles: new Map(Array.from({ length: host.style.length }, (_, index) => {
      const property = host.style.item(index);
      return [property, { value: host.style.getPropertyValue(property), priority: host.style.getPropertyPriority(property) }];
    })),
    forwardedAttributes: new Set(),
    forwardedClasses: new Set(),
    forwardedStyles: new Set(),
    host,
  };
  gridCompositionStates.set(source, state);
  return state;
}

function restoreAttribute(host: HTMLElement, state: GridCompositionState, name: string) {
  const value = state.baseAttributes.get(name);
  if (value === undefined) host.removeAttribute(name);
  else host.setAttribute(name, value);
}

function restoreGridCompositionState(state: GridCompositionState) {
  for (const token of state.forwardedClasses) {
    if (!state.baseClasses.has(token)) state.host.classList.remove(token);
  }
  for (const property of state.forwardedStyles) {
    const base = state.baseStyles.get(property);
    if (base) state.host.style.setProperty(property, base.value, base.priority);
    else state.host.style.removeProperty(property);
  }
  for (const name of state.forwardedAttributes) {
    restoreAttribute(state.host, state, name);
  }
  state.forwardedClasses.clear();
  state.forwardedStyles.clear();
  state.forwardedAttributes.clear();
}

function syncGridCompositionHost(source: HTMLElement, host: HTMLElement) {
  if (source === host) {
    return;
  }

  const state = compositionState(source, host);
  const currentClasses = new Set(source.classList);
  for (const token of state.forwardedClasses) {
    if (!currentClasses.has(token) && !state.baseClasses.has(token)) host.classList.remove(token);
  }

  for (const token of currentClasses) {
    host.classList.add(token);
  }
  state.forwardedClasses = currentClasses;

  const currentStyles = new Set<string>();
  for (let index = 0; index < source.style.length; index += 1) {
    const property = source.style.item(index);
    currentStyles.add(property);
    host.style.setProperty(property, source.style.getPropertyValue(property), source.style.getPropertyPriority(property));
  }
  for (const property of state.forwardedStyles) {
    if (currentStyles.has(property)) continue;
    const base = state.baseStyles.get(property);
    if (base) host.style.setProperty(property, base.value, base.priority);
    else host.style.removeProperty(property);
  }
  state.forwardedStyles = currentStyles;

  const currentAttributes = new Map<string, string>();
  for (const attribute of Array.from(source.attributes)) {
    const name = attribute.name;
    if (["class", "col-index", "native-composition", "row-index", "style"].includes(name)) {
      continue;
    }
    if (name.startsWith("aria-") || name.startsWith("data-") || composedAttributes.has(name)) {
      currentAttributes.set(name, attribute.value);
    }
  }
  for (const name of state.forwardedAttributes) {
    if (!currentAttributes.has(name)) restoreAttribute(host, state, name);
  }
  for (const [name, value] of currentAttributes) {
    if (host.getAttribute(name) !== value) host.setAttribute(name, value);
  }
  state.forwardedAttributes = new Set(currentAttributes.keys());

  host.removeAttribute("native-composition");
}

export function clearGridCompositionHost(source: HTMLElement) {
  const state = gridCompositionStates.get(source);
  if (!state) return;

  restoreGridCompositionState(state);
  for (const name of ["aria-selected", "data-col", "data-focused", "data-row", "data-selected", "data-value", "id", "role", "tabindex"]) {
    restoreAttribute(state.host, state, name);
  }
  gridCompositionStates.delete(source);
}

function resolvedCellValue(source: HTMLElement, host: HTMLElement, row: number, col: number) {
  if (source.hasAttribute("value")) {
    generatedCellValues.delete(host);
    return source.getAttribute("value") ?? "";
  }

  const generatedValue = generatedCellValues.get(host);
  if (host.dataset.value !== undefined && host.dataset.value !== generatedValue) {
    return host.dataset.value;
  }

  const value = cellKey(row, col);
  generatedCellValues.set(host, value);
  return value;
}

function resolvedCoordinate(source: HTMLElement, host: HTMLElement, name: "row" | "col", fallback: number) {
  const attribute = Number(source.getAttribute(name + "-index"));
  if (source.hasAttribute(name + "-index") && Number.isFinite(attribute)) {
    return { generated: false, value: attribute };
  }

  if (!source.matches("aria-grid-cell")) {
    const dataCoordinate = Number(host.dataset[name]);
    const generatedCoordinate = generatedCellCoordinates.get(host)?.[name] ?? null;
    if (Number.isFinite(dataCoordinate) && dataCoordinate !== generatedCoordinate) {
      return { generated: false, value: dataCoordinate };
    }
    return { generated: true, value: fallback };
  }

  return { generated: false, value: fallback };
}

function notifyResolvedCoordinates(source: HTMLElement, row: number, col: number) {
  if (!source.matches("aria-grid-cell")) {
    return;
  }

  const key = cellKey(row, col);
  if (resolvedCellCoordinates.get(source) === key) {
    return;
  }

  resolvedCellCoordinates.set(source, key);
  source.dispatchEvent(new CustomEvent("resolvedcoordinateschange", {
    detail: { rowIndex: row, colIndex: col },
  }));
}

function syncGridRows(root: Element) {
  for (const row of root.querySelectorAll<HTMLElement>("aria-grid-row, [role='row']")) {
    if (row.closest("aria-grid") !== root) {
      continue;
    }

    if (!row.matches("aria-grid-row") && row.closest("aria-grid-row[native-composition]")) {
      continue;
    }

    const host = row.matches("aria-grid-row") ? (row.hasAttribute("native-composition") && row.firstElementChild instanceof HTMLElement ? row.firstElementChild : row) : row;
    syncGridCompositionHost(row, host);
    if (host.getAttribute("role") !== "row") {
      host.setAttribute("role", "row");
    }

    if (host !== row) {
      row.removeAttribute("role");
      row.removeAttribute("aria-selected");
    }

    if (!host.hasAttribute("selected")) {
      host.removeAttribute("aria-selected");
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
      const source = gridCellSource(cell);
      syncGridCompositionHost(source, cell);
      const resolved = gridCellCoordinates(cell, root);
      const resolvedRow = resolvedCoordinate(source, cell, "row", resolved.row);
      const resolvedCol = resolvedCoordinate(source, cell, "col", resolved.col);
      const row = resolvedRow.value;
      const col = resolvedCol.value;
      const value = resolvedCellValue(source, cell, row, col);

      if (!source.matches("aria-grid-cell")) {
        generatedCellCoordinates.set(cell, {
          row: resolvedRow.generated ? row : null,
          col: resolvedCol.generated ? col : null,
        });
      }

      ensureCellId(cell, row, col);

      if (cell.getAttribute("role") !== "gridcell") {
        cell.setAttribute("role", "gridcell");
      }
      if (source !== cell) {
        source.removeAttribute("role");
        source.removeAttribute("tabindex");
        source.removeAttribute("aria-selected");
        source.removeAttribute("data-selected");
        source.removeAttribute("data-focused");
      }

      if (cell.dataset.row !== String(row)) cell.dataset.row = String(row);
      if (cell.dataset.col !== String(col)) cell.dataset.col = String(col);
      if (cell.dataset.value !== value) cell.dataset.value = value;
      notifyResolvedCoordinates(source, row, col);
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

      const tabIndex = isFocused ? "0" : "-1";
      if (cell.getAttribute("tabindex") !== tabIndex) cell.setAttribute("tabindex", tabIndex);

      if (isFocused) {
        if (cell.dataset.focused !== "true") cell.dataset.focused = "true";
      } else {
        cell.removeAttribute("data-focused");
      }

      if (isSelected) {
        if (cell.getAttribute("aria-selected") !== "true") cell.setAttribute("aria-selected", "true");
        if (cell.dataset.selected !== "true") cell.dataset.selected = "true";
      } else {
        cell.removeAttribute("aria-selected");
        cell.removeAttribute("data-selected");
      }
    }
  } finally {
    state.syncing = false;
  }
}
