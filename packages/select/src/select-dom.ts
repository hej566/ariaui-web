export type SelectRootElement = HTMLElement & {
  syncSelectTreeFromRoot?: () => void;
};

export function selectPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function selectRoot(element: Element) {
  return element.closest("aria-select");
}

export function selectSub(element: Element) {
  return element.closest("aria-select-sub");
}

export function selectMenu(element: Element) {
  return element.closest("aria-select-content, aria-select-sub-content");
}

export function selectElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-select") === root);
}

export function selectRootTrigger(root: Element) {
  return selectElements(root, "aria-select-trigger")[0] ?? null;
}

export function selectRootContent(root: Element) {
  return selectElements(root, "aria-select-content")[0] ?? null;
}

export function selectRootLabel(root: Element) {
  return selectElements(root, "aria-select-label")[0] ?? null;
}

export function selectSubTrigger(sub: Element) {
  return Array.from(sub.querySelectorAll<HTMLElement>("aria-select-sub-trigger")).find((element) => element.closest("aria-select-sub") === sub) ?? null;
}

export function selectSubContent(sub: Element) {
  return Array.from(sub.querySelectorAll<HTMLElement>("aria-select-sub-content")).find((element) => element.closest("aria-select-sub") === sub) ?? null;
}

export function selectMenuItems(menu: Element) {
  return Array.from(menu.querySelectorAll<HTMLElement>("aria-select-option, aria-select-sub-trigger")).filter((item) => selectMenu(item) === menu);
}

export function selectItemValue(item: HTMLElement) {
  return item.getAttribute("value") ?? item.dataset.value ?? item.textContent?.trim() ?? "";
}

export function selectValuesFromAttribute(value: string | null) {
  return (value ?? "").split(",").map((item) => item.trim()).filter(Boolean);
}

export function selectSelectionMode(root: Element) {
  return root.getAttribute("selection-mode") === "multiple" || root.getAttribute("selectionMode") === "multiple"
    ? "multiple"
    : "single";
}

export function selectRootValues(root: Element) {
  return selectValuesFromAttribute(root.getAttribute("value"));
}

export function writeSelectRootValues(root: Element, values: readonly string[]) {
  const uniqueValues = Array.from(new Set(values.filter(Boolean)));
  if (uniqueValues.length > 0) {
    root.setAttribute("value", uniqueValues.join(","));
  } else {
    root.removeAttribute("value");
  }
}

export function ensureSelectId(element: HTMLElement, prefix: string, nextId: () => number) {
  if (!element.id) {
    element.id = "ariaui-select-" + prefix + "-" + nextId();
  }

  return element.id;
}

export function isSelectDisabled(element: Element | null) {
  return Boolean(element?.hasAttribute("disabled") || element?.getAttribute("aria-disabled") === "true");
}
