export type ComboboxRootElement = HTMLElement & {
  syncComboboxTreeFromRoot?: () => void;
};

const comboboxContentRoots = new WeakMap<Element, HTMLElement>();
const comboboxRootContents = new WeakMap<Element, HTMLElement>();

export function comboboxPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function comboboxRoot(element: Element) {
  const localRoot = element.closest("aria-combobox");
  if (localRoot) {
    return localRoot;
  }

  const content = element.matches("aria-combobox-content")
    ? element
    : element.closest("aria-combobox-content");
  return content ? comboboxContentRoots.get(content) ?? null : null;
}

export function comboboxElements(root: Element, selector: string) {
  const elements = new Set(root.querySelectorAll<HTMLElement>(selector));
  const content = comboboxRootContents.get(root);
  if (content && !root.contains(content)) {
    for (const element of content.querySelectorAll<HTMLElement>(selector)) {
      elements.add(element);
    }
  }

  return Array.from(elements).filter((element) => comboboxRoot(element) === root);
}

export function comboboxTrigger(root: Element) {
  return comboboxElements(root, "aria-combobox-trigger")[0] ?? null;
}

export function comboboxInput(root: Element) {
  return comboboxElements(root, "aria-combobox-input")[0] ?? null;
}

export function comboboxButton(root: Element) {
  return comboboxElements(root, "aria-combobox-button")[0] ?? null;
}

export function comboboxContent(root: Element) {
  return comboboxRootContents.get(root)
    ?? Array.from(root.querySelectorAll<HTMLElement>("aria-combobox-content")).find((element) => element.closest("aria-combobox") === root)
    ?? null;
}

export function registerComboboxContent(root: HTMLElement, content: HTMLElement) {
  comboboxRootContents.set(root, content);
  comboboxContentRoots.set(content, root);
}

export function comboboxRootOwnsNode(root: HTMLElement, node: Node) {
  return root.contains(node) || Boolean(comboboxRootContents.get(root)?.contains(node));
}

export function comboboxOptions(root: Element) {
  return comboboxElements(root, "aria-combobox-option");
}

export function comboboxOptionsInContent(content: Element) {
  return Array.from(content.querySelectorAll<HTMLElement>("aria-combobox-option")).filter((option) => option.closest("aria-combobox-content") === content);
}

export function comboboxGroupOptions(group: Element) {
  return Array.from(group.querySelectorAll<HTMLElement>("aria-combobox-option")).filter((option) => option.closest("aria-combobox-group") === group);
}

export function comboboxItemValue(item: HTMLElement) {
  return item.getAttribute("value") ?? item.dataset.value ?? item.textContent?.trim() ?? "";
}

export function comboboxValuesFromAttribute(value: string | null) {
  return (value ?? "").split(",").map((item) => item.trim()).filter(Boolean);
}

export function comboboxSelectionMode(root: Element) {
  return root.getAttribute("selection-mode") === "multiple" || root.getAttribute("selectionMode") === "multiple"
    ? "multiple"
    : "single";
}

export function comboboxRootValues(root: Element) {
  return comboboxValuesFromAttribute(root.getAttribute("value"));
}

export function writeComboboxRootValues(root: Element, values: readonly string[]) {
  const uniqueValues = Array.from(new Set(values.filter(Boolean)));
  if (uniqueValues.length > 0) {
    root.setAttribute("value", uniqueValues.join(","));
  } else {
    root.removeAttribute("value");
  }
}

export function comboboxInputValue(root: Element) {
  return root.getAttribute("input-value") ?? root.getAttribute("inputValue") ?? "";
}

export function comboboxNativeInput(input: HTMLElement | null) {
  if (!input) {
    return null;
  }

  if (input instanceof HTMLInputElement) {
    return input;
  }

  return input.querySelector<HTMLInputElement>("input");
}

export function comboboxInputElementValue(input: HTMLElement | null) {
  const nativeInput = comboboxNativeInput(input);
  if (nativeInput) {
    return nativeInput.value;
  }

  if (input?.isContentEditable || input?.getAttribute("contenteditable") === "plaintext-only" || input?.getAttribute("contenteditable") === "true") {
    return input.textContent ?? "";
  }

  return input?.getAttribute("value") ?? "";
}

export function writeComboboxInputValue(root: Element, input: HTMLElement | null, value: string) {
  if (value) {
    root.setAttribute("input-value", value);
  } else {
    root.removeAttribute("input-value");
    root.removeAttribute("inputValue");
  }

  const nativeInput = comboboxNativeInput(input);
  if (nativeInput && nativeInput.value !== value) {
    nativeInput.value = value;
  }

  if (input && !nativeInput && (input.isContentEditable || input.getAttribute("contenteditable") === "plaintext-only" || input.getAttribute("contenteditable") === "true") && input.textContent !== value) {
    input.textContent = value;
  }

  if (input && input.getAttribute("value") !== value) {
    if (value) {
      input.setAttribute("value", value);
    } else {
      input.removeAttribute("value");
    }
  }
}

export function ensureComboboxId(element: HTMLElement, prefix: string, nextId: () => number) {
  if (!element.id) {
    element.id = "ariaui-combobox-" + prefix + "-" + nextId();
  }

  return element.id;
}

export function isComboboxDisabled(element: Element | null) {
  return Boolean(element?.hasAttribute("disabled") || element?.getAttribute("aria-disabled") === "true");
}

export function comboboxVisibleOptions(content: Element) {
  return comboboxOptionsInContent(content).filter((option) => !option.hidden && !isComboboxDisabled(option));
}

export function comboboxFallbacks(content: Element) {
  return Array.from(content.querySelectorAll<HTMLElement>("[data-combobox-fallback], .ariaui-web-combobox-empty")).filter(
    (fallback) => fallback.closest("aria-combobox-content") === content,
  );
}
