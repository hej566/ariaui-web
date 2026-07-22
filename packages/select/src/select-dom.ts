export type SelectRootElement = HTMLElement & {
  syncSelectTreeFromRoot?: () => void;
};

const selectContentRoots = new WeakMap<Element, HTMLElement>();
const selectRootContents = new WeakMap<Element, HTMLElement>();
const selectContentSubs = new WeakMap<Element, HTMLElement>();
const selectSubContents = new WeakMap<Element, HTMLElement>();

export function selectPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function selectRoot(element: Element) {
  const localRoot = element.closest("aria-select");
  if (localRoot) {
    return localRoot;
  }

  const content = element.matches("aria-select-content, aria-select-sub-content")
    ? element
    : element.closest("aria-select-content, aria-select-sub-content");
  return content ? selectContentRoots.get(content) ?? null : null;
}

export function selectSub(element: Element) {
  const localSub = element.closest("aria-select-sub");
  if (localSub) {
    return localSub;
  }

  const content = element.matches("aria-select-sub-content")
    ? element
    : element.closest("aria-select-sub-content");
  return content ? selectContentSubs.get(content) ?? null : null;
}

export function selectMenu(element: Element) {
  return element.closest("aria-select-content, aria-select-sub-content");
}

export function selectElements(root: Element, selector: string) {
  const elements = new Set(root.querySelectorAll<HTMLElement>(selector));
  const content = selectRootContents.get(root);
  if (content && !root.contains(content)) {
    for (const element of content.querySelectorAll<HTMLElement>(selector)) {
      elements.add(element);
    }

    for (const sub of content.querySelectorAll<HTMLElement>("aria-select-sub")) {
      const subContent = selectSubContents.get(sub);
      for (const element of subContent?.querySelectorAll<HTMLElement>(selector) ?? []) {
        elements.add(element);
      }
    }
  }

  return Array.from(elements).filter((element) => selectRoot(element) === root);
}

export function selectRootTrigger(root: Element) {
  return selectElements(root, "aria-select-trigger")[0] ?? null;
}

export function selectRootContent(root: Element) {
  return selectRootContents.get(root)
    ?? Array.from(root.querySelectorAll<HTMLElement>("aria-select-content")).find((element) => element.closest("aria-select") === root)
    ?? null;
}

export function selectRootLabel(root: Element) {
  return selectElements(root, "aria-select-label")[0] ?? null;
}

export function selectSubTrigger(sub: Element) {
  return Array.from(sub.querySelectorAll<HTMLElement>("aria-select-sub-trigger")).find((element) => element.closest("aria-select-sub") === sub) ?? null;
}

export function selectSubContent(sub: Element) {
  return selectSubContents.get(sub)
    ?? Array.from(sub.querySelectorAll<HTMLElement>("aria-select-sub-content")).find((element) => element.closest("aria-select-sub") === sub)
    ?? null;
}

export function registerSelectRootContent(root: HTMLElement, content: HTMLElement) {
  selectRootContents.set(root, content);
  selectContentRoots.set(content, root);
}

export function registerSelectSubContent(root: HTMLElement, sub: HTMLElement, content: HTMLElement) {
  selectSubContents.set(sub, content);
  selectContentSubs.set(content, sub);
  selectContentRoots.set(content, root);
}

export function selectRootOwnsNode(root: HTMLElement, node: Node) {
  if (root.contains(node)) {
    return true;
  }

  const content = selectRootContents.get(root);
  if (content?.contains(node)) {
    return true;
  }

  return selectElements(root, "aria-select-sub").some((sub) => selectSubContents.get(sub)?.contains(node));
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
