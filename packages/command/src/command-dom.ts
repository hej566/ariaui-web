let commandId = 0;

export function commandPartName(element: Element) {
  return element.getAttribute("data-part") ?? "";
}

export function commandRoot(element: Element | null) {
  return element?.closest("aria-command") ?? null;
}

export function commandInput(root: Element) {
  return root.querySelector<HTMLElement>(":scope > aria-command-input, aria-command-input");
}

export function commandContent(root: Element) {
  return root.querySelector<HTMLElement>(":scope > aria-command-content, aria-command-content");
}

export function commandOptions(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-command-option"));
}

export function commandGroups(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-command-group"));
}

export function commandEmptyElements(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-command-empty"));
}

export function commandSeparators(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-command-separator"));
}

export function commandLoadingElements(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-command-loading"));
}

export function ensureCommandId(element: HTMLElement, prefix: string) {
  if (!element.id) {
    commandId += 1;
    element.id = `aria-command-${prefix}-${commandId}`;
  }

  return element.id;
}

export function hasCommandBoolean(element: Element, kebab: string, camel = kebab.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())) {
  const kebabValue = element.getAttribute(kebab);
  const camelValue = element.getAttribute(camel);
  return (element.hasAttribute(kebab) && kebabValue !== "false") || (element.hasAttribute(camel) && camelValue !== "false");
}

export function setCommandBoolean(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

export function commandValue(element: Element) {
  return element.getAttribute("value") ?? "";
}

export function commandSearchValue(root: Element) {
  return root.getAttribute("search-value") ?? root.getAttribute("searchValue") ?? "";
}

export function writeCommandSearchValue(root: Element, input: HTMLElement | null, value: string) {
  if (value) {
    root.setAttribute("search-value", value);
  } else {
    root.removeAttribute("search-value");
  }

  if (input) {
    writeCommandInputValue(input, value);
  }
}

export function commandInputValue(input: HTMLElement | null) {
  if (!input) {
    return "";
  }

  const nativeInput = input.querySelector("input");
  if (nativeInput instanceof HTMLInputElement) {
    return nativeInput.value;
  }

  if (input.isContentEditable || input.getAttribute("contenteditable")) {
    return input.textContent ?? "";
  }

  return input.getAttribute("value") ?? "";
}

export function writeCommandInputValue(input: HTMLElement, value: string) {
  const nativeInput = input.querySelector("input");
  if (nativeInput instanceof HTMLInputElement && nativeInput.value !== value) {
    nativeInput.value = value;
  }

  if (!(nativeInput instanceof HTMLInputElement) && (input.isContentEditable || input.getAttribute("contenteditable"))) {
    if (input.textContent !== value) {
      input.textContent = value;
    }
  }

  if (value) {
    input.setAttribute("value", value);
  } else {
    input.removeAttribute("value");
  }
}

export function commandOptionValue(option: HTMLElement) {
  return option.getAttribute("value") ?? option.dataset.value ?? option.textContent?.trim() ?? "";
}

export function commandOptionKeywords(option: HTMLElement) {
  const propertyValue = (option as HTMLElement & { keywords?: unknown }).keywords;
  if (Array.isArray(propertyValue)) {
    return propertyValue.map(String);
  }

  return (option.getAttribute("keywords") ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}
