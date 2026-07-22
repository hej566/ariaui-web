export const textareaForwardedAttributes = [
  "aria-describedby",
  "aria-errormessage",
  "aria-invalid",
  "aria-label",
  "aria-labelledby",
  "autocapitalize",
  "autocomplete",
  "autofocus",
  "cols",
  "dirname",
  "form",
  "inputmode",
  "maxlength",
  "minlength",
  "name",
  "placeholder",
  "readonly",
  "required",
  "rows",
  "spellcheck",
  "tabindex",
  "title",
  "wrap",
] as const;

export function textareaPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function ownedTextarea(element: HTMLElement) {
  return element.querySelector<HTMLTextAreaElement>(
    ":scope > textarea[data-ariaui-web-textarea='true']",
  );
}

export function createOwnedTextarea(ownerDocument: Document) {
  const textarea = ownerDocument.createElement("textarea");
  textarea.dataset.ariauiWebTextarea = "true";
  return textarea;
}
