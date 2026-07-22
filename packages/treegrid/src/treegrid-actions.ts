import {
  allRows,
  eventItem,
  firstCell,
  isDisabled,
  itemFocus,
  itemRow,
  parentRow,
  rowById,
  rowCells,
  visibleRows,
  type TreegridFocus,
} from "./treegrid-dom";
import {
  expandedValues,
  requestExpanded,
  requestSelectedRows,
  selectedRowValues,
  setTreegridFocus,
  syncTreegrid,
  treegridState,
} from "./treegrid-sync";

const boundRoots = new WeakSet<HTMLElement>();
const boundHeaders = new WeakSet<HTMLElement>();

function toggleExpansion(root: HTMLElement, row: HTMLElement) {
  if (!row.hasAttribute("aria-expanded") || isDisabled(root, row)) return;
  const id = row.dataset.rowId!;
  const current = expandedValues(root);
  requestExpanded(root, current.includes(id) ? current.filter((item) => item !== id) : [...current, id], row);
}

function selectRows(root: HTMLElement, row: HTMLElement, options: { multi?: boolean; range?: boolean } = {}) {
  if (isDisabled(root, row)) return;
  const state = treegridState(root);
  const id = row.dataset.rowId!;
  const multiSelect = root.hasAttribute("multi-select");
  const current = new Set(selectedRowValues(root));
  if (options.range && state.anchorRow) {
    const ids = visibleRows(root).map((item) => item.dataset.rowId!);
    const start = ids.indexOf(state.anchorRow);
    const end = ids.indexOf(id);
    if (!options.multi) current.clear();
    if (start >= 0 && end >= 0) {
      for (let index = Math.min(start, end); index <= Math.max(start, end); index += 1) current.add(ids[index]!);
    }
  } else if (multiSelect && options.multi) {
    if (current.has(id)) current.delete(id);
    else current.add(id);
    state.anchorRow = id;
  } else {
    current.clear();
    current.add(id);
    state.anchorRow = id;
  }
  if (!multiSelect || (!options.multi && !options.range)) state.selectedCells.clear();
  requestSelectedRows(root, Array.from(current), row);
}

function selectCell(root: HTMLElement, row: HTMLElement, col: number, options: { multi?: boolean; range?: boolean } = {}) {
  if (isDisabled(root, row)) return;
  const state = treegridState(root);
  const id = row.dataset.rowId!;
  const key = `${id}:${col}`;
  const multiSelect = root.hasAttribute("multi-select");
  if (!options.range) state.anchorCell = { rowId: id, col };
  if (!multiSelect || (!options.multi && !options.range)) {
    state.selectedCells.clear();
    requestSelectedRows(root, [], row);
  }
  if (multiSelect && options.range && state.anchorCell) {
    if (!options.multi) state.selectedCells.clear();
    const ids = visibleRows(root).map((item) => item.dataset.rowId!);
    const startRow = ids.indexOf(state.anchorCell.rowId);
    const endRow = ids.indexOf(id);
    if (startRow >= 0 && endRow >= 0) {
      for (let rowIndex = Math.min(startRow, endRow); rowIndex <= Math.max(startRow, endRow); rowIndex += 1) {
        for (let cellIndex = Math.min(state.anchorCell.col, col); cellIndex <= Math.max(state.anchorCell.col, col); cellIndex += 1) {
          state.selectedCells.add(`${ids[rowIndex]}:${cellIndex}`);
        }
      }
    }
  } else if (multiSelect && options.multi) {
    if (state.selectedCells.has(key)) state.selectedCells.delete(key);
    else state.selectedCells.add(key);
  } else {
    state.selectedCells.add(key);
  }
  syncTreegrid(root);
}

function focus(root: HTMLElement, next: TreegridFocus | null) {
  if (next) setTreegridFocus(root, next);
}

function currentFocus(root: HTMLElement) {
  const active = root.ownerDocument.activeElement;
  if (active instanceof HTMLElement) {
    const resolved = itemFocus(active);
    if (resolved) return resolved;
  }
  return treegridState(root).focus;
}

function rowTarget(root: HTMLElement, current: TreegridFocus, offset: number) {
  const rows = visibleRows(root);
  const index = rows.findIndex((row) => row.dataset.rowId === current.rowId);
  const target = rows[Math.max(0, Math.min(rows.length - 1, index + offset))];
  if (!target) return null;
  if (current.mode === "row") return { mode: "row", rowId: target.dataset.rowId! } as const;
  const col = Math.min(current.col, Math.max(0, rowCells(target).length - 1));
  return rowCells(target).length ? { mode: "cell", rowId: target.dataset.rowId!, col } as const : { mode: "row", rowId: target.dataset.rowId! } as const;
}

function handleRowKey(root: HTMLElement, current: Extract<TreegridFocus, { mode: "row" }>, event: KeyboardEvent) {
  const row = rowById(root, current.rowId);
  if (!row) return false;
  if (event.key === "ArrowRight") {
    if (row.getAttribute("aria-expanded") === "false") toggleExpansion(root, row);
    else focus(root, { mode: "cell", rowId: current.rowId, col: 0 });
  } else if (event.key === "ArrowLeft") {
    if (row.getAttribute("aria-expanded") === "true") toggleExpansion(root, row);
    else {
      const parent = parentRow(root, row);
      if (parent) focus(root, { mode: "row", rowId: parent.dataset.rowId! });
    }
  } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    const next = rowTarget(root, current, event.key === "ArrowDown" ? 1 : -1);
    focus(root, next);
    if (event.shiftKey) selectRows(root, rowById(root, next?.rowId ?? "") ?? row, { range: true, multi: event.ctrlKey || event.metaKey });
  } else if (event.key === "PageDown" || event.key === "PageUp") {
    focus(root, rowTarget(root, current, event.key === "PageDown" ? 5 : -5));
  } else if (event.key === "Home" || event.key === "End") {
    const rows = visibleRows(root);
    const target = event.key === "Home" ? rows[0] : rows[rows.length - 1];
    if (target) focus(root, { mode: "row", rowId: target.dataset.rowId! });
  } else if (event.key === "Enter") {
    toggleExpansion(root, row);
  } else if (event.key === " ") {
    selectRows(root, row, { multi: event.ctrlKey || event.metaKey, range: event.shiftKey });
  } else return false;
  return true;
}

function handleCellKey(root: HTMLElement, current: Extract<TreegridFocus, { mode: "cell" }>, event: KeyboardEvent) {
  const row = rowById(root, current.rowId);
  if (!row) return false;
  const cells = rowCells(row);
  let next: TreegridFocus | null = null;
  if (event.key === "ArrowLeft") next = current.col === 0 ? { mode: "row", rowId: current.rowId } : { ...current, col: current.col - 1 };
  else if (event.key === "ArrowRight") next = { ...current, col: Math.min(cells.length - 1, current.col + 1) };
  else if (event.key === "ArrowDown" || event.key === "ArrowUp") next = rowTarget(root, current, event.key === "ArrowDown" ? 1 : -1);
  else if (event.key === "PageDown" || event.key === "PageUp") next = rowTarget(root, current, event.key === "PageDown" ? 5 : -5);
  else if (event.key === "Home" && !event.ctrlKey && !event.metaKey) next = { ...current, col: 0 };
  else if (event.key === "End" && !event.ctrlKey && !event.metaKey) next = { ...current, col: Math.max(0, cells.length - 1) };
  else if ((event.key === "Home" || event.key === "End") && (event.ctrlKey || event.metaKey)) {
    const rows = visibleRows(root);
    const target = event.key === "Home" ? rows[0] : rows[rows.length - 1];
    if (target) next = { mode: "cell", rowId: target.dataset.rowId!, col: event.key === "Home" ? 0 : Math.min(current.col, Math.max(0, rowCells(target).length - 1)) };
  } else if (event.key === " " && (event.ctrlKey || event.metaKey)) {
    for (const item of visibleRows(root)) stateCell(root, item.dataset.rowId!, current.col, true);
    syncTreegrid(root);
    return true;
  } else if (event.key === " ") {
    selectCell(root, row, current.col, { multi: event.ctrlKey || event.metaKey, range: event.shiftKey });
    return true;
  } else if (event.key === "Enter") {
    toggleExpansion(root, row);
    return true;
  } else return false;

  if (next) {
    focus(root, next);
    if (event.shiftKey && next.mode === "cell") {
      const target = rowById(root, next.rowId);
      if (target) selectCell(root, target, next.col, { range: true, multi: event.ctrlKey || event.metaKey });
    }
  }
  return true;
}

function stateCell(root: HTMLElement, rowId: string, col: number, selected: boolean) {
  const key = `${rowId}:${col}`;
  if (selected) treegridState(root).selectedCells.add(key);
  else treegridState(root).selectedCells.delete(key);
}

function selectAll(root: HTMLElement) {
  if (!root.hasAttribute("multi-select")) return;
  const rows = allRows(root);
  const ids = rows.map((row) => row.dataset.rowId!);
  for (const row of rows) rowCells(row).forEach((_cell, col) => stateCell(root, row.dataset.rowId!, col, true));
  requestSelectedRows(root, ids, root);
}

function typeahead(root: HTMLElement, current: TreegridFocus | null, key: string) {
  if (key.length !== 1 || key === " ") return false;
  const state = treegridState(root);
  const now = Date.now();
  state.typeaheadBuffer = now - state.typeaheadAt > 500 ? key : state.typeaheadBuffer + key;
  state.typeaheadAt = now;
  const rows = visibleRows(root);
  const start = Math.max(0, rows.findIndex((row) => row.dataset.rowId === current?.rowId));
  const ordered = [...rows.slice(start + 1), ...rows.slice(0, start + 1)];
  const query = state.typeaheadBuffer.toLowerCase();
  const match = ordered.find((row) => rowCells(row)[0]?.textContent?.trim().toLowerCase().startsWith(query));
  if (!match) return false;
  focus(root, current?.mode === "cell" ? { mode: "cell", rowId: match.dataset.rowId!, col: current.col } : { mode: "row", rowId: match.dataset.rowId! });
  return true;
}

export function bindTreegridRoot(root: HTMLElement) {
  if (boundRoots.has(root)) return;
  boundRoots.add(root);
  root.addEventListener("focusin", (event) => {
    if (event.target === root) {
      const first = firstCell(root);
      const initial = first ? itemFocus(first) : null;
      if (initial) setTreegridFocus(root, initial);
      return;
    }
    const item = eventItem(event.target, root);
    const resolved = item ? itemFocus(item) : null;
    if (resolved) setTreegridFocus(root, resolved, false);
  });
  root.addEventListener("mousedown", (event) => {
    const item = eventItem(event.target, root);
    const row = item ? itemRow(item) : null;
    if (!item || !row || isDisabled(root, row)) return;
    const resolved = itemFocus(item);
    if (!resolved) return;
    event.preventDefault();
    setTreegridFocus(root, resolved);
    if (resolved.mode === "row") selectRows(root, row, { multi: event.ctrlKey || event.metaKey, range: event.shiftKey });
    else selectCell(root, row, resolved.col, { multi: event.ctrlKey || event.metaKey, range: event.shiftKey });
  });
  root.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>("aria-treegrid-row-header") : null;
    const row = target ? itemRow(target) : null;
    if (row && row.closest("aria-treegrid") === root) toggleExpansion(root, row);
  });
  root.addEventListener("keydown", (event) => {
    if (isDisabled(root)) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
      event.preventDefault();
      selectAll(root);
      return;
    }
    const current = currentFocus(root);
    if (!current) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const rows = visibleRows(root);
        const target = event.key === "ArrowDown" ? rows[0] : rows[rows.length - 1];
        if (target) focus(root, { mode: "cell", rowId: target.dataset.rowId!, col: 0 });
        event.preventDefault();
      }
      return;
    }
    const handled = current.mode === "row" ? handleRowKey(root, current, event) : handleCellKey(root, current, event);
    if (handled || typeahead(root, current, event.key)) event.preventDefault();
  });
}

export function bindTreegridColumnHeader(header: HTMLElement) {
  if (boundHeaders.has(header)) return;
  boundHeaders.add(header);
  header.addEventListener("click", () => {
    if (!header.hasAttribute("sortable")) return;
    const event = new CustomEvent("sort", { bubbles: true, cancelable: true, detail: { direction: header.getAttribute("sort-direction") } });
    if (!header.dispatchEvent(event)) return;
    (header as HTMLElement & { onSort?: (() => void) | null }).onSort?.();
  });
}
