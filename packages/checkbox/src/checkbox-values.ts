export function checkboxValuesFromAttribute(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item)).filter(Boolean);
      }
    } catch {
      // Fall back to comma parsing below.
    }
  }

  return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
}

export function uniqueCheckboxValues(values: readonly string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function serializeCheckboxValues(values: readonly string[]) {
  return uniqueCheckboxValues(values).join(",");
}

export function writeCheckboxGroupValue(group: HTMLElement, values: readonly string[]) {
  group.setAttribute("value", serializeCheckboxValues(values));
}
