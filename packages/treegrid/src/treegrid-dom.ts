export type TreegridFocus =
  | { mode: "row"; rowId: string }
  | { mode: "cell"; rowId: string; col: number };

let generatedRowId = 0;
const generatedIds = new WeakMap<HTMLElement, string>();

export function treegridPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function treegridRoot(element: Element | null) {
  return element?.matches("aria-treegrid")
    ? element as HTMLElement
    : element?.closest<HTMLElement>("aria-treegrid") ?? null;
}

export function treegridGroupHost(group: HTMLElement) {
  if (!group.hasAttribute("native-composition")) return group;
  return Array.from(group.children).find((child): child is HTMLElement => child instanceof HTMLElement) ?? group;
}

export function directRows(container: Element) {
  return Array.from(container.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement && child.matches("aria-treegrid-row"),
  );
}

export function directGroups(container: Element) {
  return Array.from(container.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement && child.matches("aria-treegrid-group"),
  );
}

export function rowId(row: HTMLElement) {
  const explicit = row.getAttribute("value");
  if (explicit) return explicit;
  let generated = generatedIds.get(row);
  if (!generated) {
    generated = `ariaui-treegrid-row-${++generatedRowId}`;
    generatedIds.set(row, generated);
  }
  return generated;
}

export function rowCells(row: Element) {
  return Array.from(row.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement
      && child.matches("aria-treegrid-row-header, aria-treegrid-cell"),
  );
}

export function allRows(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-treegrid-row"))
    .filter((row) => row.closest("aria-treegrid") === root);
}

export function visibleRows(root: Element) {
  return allRows(root).filter((row) => !row.hidden && row.getAttribute("aria-hidden") !== "true");
}

export function rowById(root: Element, id: string) {
  return allRows(root).find((row) => row.dataset.rowId === id) ?? null;
}

export function parentRow(root: Element, row: HTMLElement) {
  const id = row.dataset.parentRowId;
  return id ? rowById(root, id) : null;
}

export function parseValues(value: string | null) {
  if (!value) return [];
  return Array.from(new Set(value.split(",").map((item) => item.trim()).filter(Boolean)));
}

export function writeValues(element: Element, attribute: string, values: readonly string[]) {
  const value = Array.from(new Set(values)).join(",");
  if (element.getAttribute(attribute) !== value) element.setAttribute(attribute, value);
}

export function isDisabled(root: Element, target?: Element | null) {
  return root.hasAttribute("disabled") || Boolean(target?.closest("aria-treegrid-row[disabled]"));
}

export function eventItem(target: EventTarget | null, root: Element) {
  if (!(target instanceof Element)) return null;
  const item = target.closest<HTMLElement>("aria-treegrid-row-header, aria-treegrid-cell, aria-treegrid-row");
  return item?.closest("aria-treegrid") === root ? item : null;
}

export function itemRow(item: HTMLElement) {
  return item.matches("aria-treegrid-row") ? item : item.closest<HTMLElement>("aria-treegrid-row");
}

export function itemFocus(item: HTMLElement): TreegridFocus | null {
  const row = itemRow(item);
  const id = row?.dataset.rowId;
  if (!row || !id) return null;
  if (item === row) return { mode: "row", rowId: id };
  const col = rowCells(row).indexOf(item);
  return col < 0 ? null : { mode: "cell", rowId: id, col };
}

export function focusElement(root: Element, focus: TreegridFocus | null) {
  if (!focus) return null;
  const row = rowById(root, focus.rowId);
  if (!row) return null;
  return focus.mode === "row" ? row : rowCells(row)[focus.col] ?? null;
}

export function firstCell(root: Element) {
  const firstRow = visibleRows(root)[0];
  return firstRow ? rowCells(firstRow)[0] ?? firstRow : null;
}
