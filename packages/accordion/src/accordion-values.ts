export function accordionValuesFromAttribute(value: string | null, type: string) {
  if (value == null) {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item));
      }
    } catch {
      return [];
    }
  }

  if (type === "multiple") {
    return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [trimmed];
}

export function uniqueAccordionValues(values: readonly string[]) {
  return Array.from(new Set(values));
}

export function accordionValuesEqual(first: readonly string[], second: readonly string[]) {
  return first.length === second.length && first.every((value, index) => value === second[index]);
}

export function serializeAccordionValues(type: string, values: readonly string[]) {
  return type === "multiple" ? values.join(",") : values[0] ?? "";
}

export function writeAccordionRootValue(root: Element, type: string, values: readonly string[]) {
  const serialized = serializeAccordionValues(type, uniqueAccordionValues(values));
  if (root.getAttribute("value") !== serialized) {
    root.setAttribute("value", serialized);
  }
}

export function accordionRootValues(root: Element, type: string) {
  if (!root.hasAttribute("value")) {
    const defaultValue = root.getAttribute("default-value") ?? root.getAttribute("defaultvalue");
    if (defaultValue != null) {
      writeAccordionRootValue(root, type, accordionValuesFromAttribute(defaultValue, type));
    }
  }

  return uniqueAccordionValues(accordionValuesFromAttribute(root.getAttribute("value"), type));
}

export function accordionItemValue(item: Element, index = 0) {
  return item.getAttribute("value") ?? String(index);
}

export function accordionIdPart(value: string, index: number) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return normalized || String(index);
}
