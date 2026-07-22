export const toggleForwardedAttributes = [
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
  "tabindex",
  "title",
  "value",
] as const;

export function togglePartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function ownedToggleButton(element: HTMLElement) {
  return element.querySelector<HTMLButtonElement>(
    ":scope > button[data-ariaui-web-toggle-control='true']",
  );
}

export function createToggleButton(document: Document) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.ariauiWebToggleControl = "true";
  return button;
}
