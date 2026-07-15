export type ListboxRootElement = HTMLElement & {
  syncListboxTreeFromRoot?: () => void;
};

export function listboxPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function listboxRoot(element: Element) {
  return element.closest<HTMLElement>("aria-listbox");
}

export function listboxSub(element: Element) {
  return element.closest<HTMLElement>("aria-listbox-sub");
}

export function listboxMenu(element: Element) {
  return element.closest<HTMLElement>("aria-listbox-content, aria-listbox-sub-content");
}

export function listboxElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => element.closest("aria-listbox") === root,
  );
}

export function listboxRootLabel(root: Element) {
  return listboxElements(root, "aria-listbox-label")[0] ?? null;
}

export function listboxRootContent(root: Element) {
  return listboxElements(root, "aria-listbox-content")[0] ?? null;
}

export function listboxSubTrigger(sub: Element) {
  return Array.from(sub.querySelectorAll<HTMLElement>("aria-listbox-sub-trigger")).find(
    (element) => element.closest("aria-listbox-sub") === sub,
  ) ?? null;
}

export function listboxSubContent(sub: Element) {
  return Array.from(sub.querySelectorAll<HTMLElement>("aria-listbox-sub-content")).find(
    (element) => element.closest("aria-listbox-sub") === sub,
  ) ?? null;
}

export function listboxMenuItems(menu: Element) {
  return Array.from(menu.querySelectorAll<HTMLElement>(
    "aria-listbox-option, aria-listbox-sub-trigger",
  )).filter((item) => listboxMenu(item) === menu);
}

export function listboxMenuOptions(menu: Element) {
  return Array.from(menu.querySelectorAll<HTMLElement>("aria-listbox-option")).filter(
    (option) => listboxMenu(option) === menu,
  );
}

export function listboxItemValue(item: HTMLElement) {
  return item.getAttribute("value") ?? item.dataset.value ?? item.textContent?.trim() ?? "";
}

export function listboxValuesFromAttribute(value: string | null) {
  return (value ?? "").split(",").map((item) => item.trim()).filter(Boolean);
}

export function listboxSelectionMode(root: Element | null) {
  return root?.getAttribute("selection-mode") === "multiple" ||
    root?.getAttribute("selectionMode") === "multiple"
    ? "multiple"
    : "single";
}

export function listboxRootValues(root: Element) {
  return listboxValuesFromAttribute(root.getAttribute("value"));
}

export function writeListboxRootValues(root: Element, values: readonly string[]) {
  const unique = Array.from(new Set(values.filter(Boolean)));
  if (unique.length) root.setAttribute("value", unique.join(","));
  else root.removeAttribute("value");
}

let listboxId = 0;
export function ensureListboxId(element: HTMLElement, part: string) {
  if (!element.id) {
    listboxId += 1;
    element.id = `ariaui-listbox-${part}-${listboxId}`;
  }
  return element.id;
}

export function isListboxDisabled(element: Element | null) {
  return Boolean(element?.hasAttribute("disabled") || element?.getAttribute("aria-disabled") === "true");
}

export type ListboxOffset = { x: number; y: number };

export function listboxSubOffset(sub: HTMLElement): ListboxOffset {
  const property = (sub as HTMLElement & { offset?: ListboxOffset }).offset;
  if (property && Number.isFinite(property.x) && Number.isFinite(property.y)) return property;
  const x = Number(sub.getAttribute("offset-x") ?? 0);
  const y = Number(sub.getAttribute("offset-y") ?? 0);
  return { x: Number.isFinite(x) ? x : 0, y: Number.isFinite(y) ? y : 0 };
}
