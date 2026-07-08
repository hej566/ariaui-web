export function createElementTagName(packageSlug: string, partName = "Root") {
  return partName === "Root" ? `aria-${packageSlug}` : `aria-${packageSlug}-${kebabCase(partName)}`;
}

export function kebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}
