let generatedItemId = 0;
const generatedIds = new WeakMap<HTMLElement, string>();

export function treeviewPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function treeviewRoot(element: Element | null) {
  return element?.matches("aria-treeview")
    ? element as HTMLElement
    : element?.closest<HTMLElement>("aria-treeview") ?? null;
}

export function itemValue(item: HTMLElement) {
  const explicit = item.getAttribute("value");
  if (explicit) return explicit;
  let generated = generatedIds.get(item);
  if (!generated) {
    generated = `ariaui-treeview-item-${++generatedItemId}`;
    generatedIds.set(item, generated);
  }
  return generated;
}

export function allItems(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-treeview-item, aria-treeview-checkbox-item"))
    .filter((item) => item.closest("aria-treeview") === root);
}

export function itemGroup(item: Element) {
  return Array.from(item.children).find(
    (child): child is HTMLElement => child instanceof HTMLElement && child.matches("aria-treeview-group"),
  ) ?? null;
}

export function groupHost(group: HTMLElement) {
  if (!group.hasAttribute("native-composition")) return group;
  return Array.from(group.children).find((child): child is HTMLElement => child instanceof HTMLElement) ?? group;
}

export function parentItem(item: HTMLElement) {
  const group = item.parentElement?.closest<HTMLElement>("aria-treeview-group");
  if (!group || group.closest("aria-treeview") !== item.closest("aria-treeview")) return null;
  return group.parentElement?.closest<HTMLElement>("aria-treeview-item, aria-treeview-checkbox-item") ?? null;
}

export function isItemDisabled(root: Element, item?: Element | null) {
  return root.hasAttribute("disabled") || Boolean(item?.hasAttribute("disabled"));
}

export function visibleItems(root: Element) {
  return allItems(root).filter((item) => !item.hidden && item.getAttribute("aria-hidden") !== "true" && !isItemDisabled(root, item));
}

export function parseValues(value: string | null) {
  return Array.from(new Set((value ?? "").split(",").map((part) => part.trim()).filter(Boolean)));
}

export function writeValues(element: Element, attribute: string, values: readonly string[]) {
  const next = Array.from(new Set(values)).join(",");
  if (element.getAttribute(attribute) !== next) element.setAttribute(attribute, next);
}

export function eventItem(target: EventTarget | null, root: Element) {
  if (!(target instanceof Element)) return null;
  const item = target.closest<HTMLElement>("aria-treeview-item, aria-treeview-checkbox-item");
  return item?.closest("aria-treeview") === root ? item : null;
}

export function itemByValue(root: Element, value: string) {
  return allItems(root).find((item) => itemValue(item) === value) ?? null;
}

export function itemLabel(item: HTMLElement) {
  const clone = item.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("aria-treeview-group").forEach((group) => group.remove());
  return clone.textContent?.trim().toLowerCase() ?? "";
}
