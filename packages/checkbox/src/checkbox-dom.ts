export function checkboxPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function isCheckboxElement(element: Element | null): element is HTMLElement {
  return element instanceof HTMLElement && element.matches("aria-checkbox, aria-checkbox-item");
}

export function isCheckboxGroupElement(element: Element | null): element is HTMLElement {
  return element instanceof HTMLElement && element.matches("aria-checkbox-group");
}

export function isCheckboxIndicatorElement(element: Element | null): element is HTMLElement {
  return element instanceof HTMLElement && element.matches("aria-checkbox-indicator");
}

export function checkboxGroup(element: HTMLElement) {
  return element.closest<HTMLElement>("aria-checkbox-group");
}

export function checkboxItems(group: HTMLElement) {
  return Array.from(group.querySelectorAll<HTMLElement>("aria-checkbox, aria-checkbox-item")).filter((item) => checkboxGroup(item) === group);
}

export function checkboxIndicatorOwner(indicator: HTMLElement) {
  return indicator.closest<HTMLElement>("aria-checkbox, aria-checkbox-item");
}

export function checkboxIndicators(owner: HTMLElement) {
  return Array.from(owner.querySelectorAll<HTMLElement>("aria-checkbox-indicator")).filter((indicator) => checkboxIndicatorOwner(indicator) === owner);
}
