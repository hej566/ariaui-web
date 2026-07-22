export const itemForwardedAttributes = [
  "aria-describedby",
  "aria-label",
  "aria-labelledby",
  "autofocus",
  "form",
  "formaction",
  "formenctype",
  "formmethod",
  "formnovalidate",
  "formtarget",
  "name",
  "popovertarget",
  "popovertargetaction",
  "title",
] as const;

export function toggleGroupPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function ownedItemButton(element: HTMLElement) {
  return element.querySelector<HTMLButtonElement>(
    ":scope > button[data-ariaui-web-toggle-group-control='true']",
  );
}

export function createItemButton(document: Document) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.ariauiWebToggleGroupControl = "true";
  return button;
}

export function ownerToggleGroup(item: HTMLElement) {
  return item.parentElement?.closest<HTMLElement>("aria-toggle-group") ?? null;
}

export function ownedToggleGroupItems(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-toggle-group-item"))
    .filter((item) => ownerToggleGroup(item) === root);
}
