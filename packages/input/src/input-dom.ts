export const inputForwardedAttributes = [
  "aria-describedby",
  "aria-invalid",
  "aria-label",
  "autocomplete",
  "inputmode",
  "maxlength",
  "minlength",
  "name",
  "pattern",
  "placeholder",
  "readonly",
  "role",
] as const;

export const inputLegacyAttributes = ["isDisabled", "isRequired", "isdisabled", "isrequired"] as const;

export function inputPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function ownedInput(element: HTMLElement) {
  return element.querySelector("input[data-ariaui-web-input='true']") as HTMLInputElement | null;
}

export function createOwnedInput() {
  const input = document.createElement("input");
  input.dataset.ariauiWebInput = "true";
  return input;
}
