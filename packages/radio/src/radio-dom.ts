export function isRadioRoot(element: Element | null): element is HTMLElement {
  return element instanceof HTMLElement && element.matches("aria-radio");
}

export function isRadioItem(element: Element | null): element is HTMLElement {
  return element instanceof HTMLElement && element.matches("aria-radio-item");
}

export function isRadioIndicator(
  element: Element | null,
): element is HTMLElement {
  return (
    element instanceof HTMLElement && element.matches("aria-radio-indicator")
  );
}

export function radioRoot(element: HTMLElement) {
  return element.closest<HTMLElement>("aria-radio");
}

export function radioItems(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>("aria-radio-item"),
  ).filter((item) => radioRoot(item) === root);
}

export function radioIndicatorOwner(indicator: HTMLElement) {
  return indicator.closest<HTMLElement>("aria-radio-item");
}

export function radioIndicators(item: HTMLElement) {
  return Array.from(
    item.querySelectorAll<HTMLElement>("aria-radio-indicator"),
  ).filter((indicator) => radioIndicatorOwner(indicator) === item);
}

export function radioItemDisabled(item: HTMLElement, root = radioRoot(item)) {
  return (
    item.hasAttribute("disabled") || Boolean(root?.hasAttribute("disabled"))
  );
}
