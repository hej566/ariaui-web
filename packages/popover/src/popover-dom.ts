export type PopoverRootElement = HTMLElement & {
  open: boolean;
  syncPopoverTreeFromRoot: () => void;
};

let popoverId = 0;

export function popoverPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function popoverRoot(element: Element) {
  return element.matches("aria-popover") ? element : element.closest("aria-popover");
}

export function popoverElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => element.closest("aria-popover") === root,
  );
}

export function popoverTrigger(root: Element) {
  return popoverElements(root, "aria-popover-trigger")[0] ?? null;
}

export function popoverContent(root: Element) {
  return popoverElements(root, "aria-popover-content")[0] ?? null;
}

export function popoverContentHost(content: HTMLElement) {
  if (!content.hasAttribute("native-composition")) return content;
  return Array.from(content.children).find(
    (child): child is HTMLElement => child instanceof HTMLElement && !child.hasAttribute("data-popover-arrow"),
  ) ?? content;
}

export function popoverHeadingHosts(content: Element) {
  return Array.from(content.querySelectorAll<HTMLElement>("aria-popover-heading"))
    .filter((heading) => heading.closest("aria-popover-content") === content)
    .map((heading) => heading.hasAttribute("native-composition") && heading.firstElementChild instanceof HTMLElement
      ? heading.firstElementChild
      : heading);
}

export function popoverDescriptionHosts(content: Element) {
  return Array.from(content.querySelectorAll<HTMLElement>("aria-popover-description"))
    .filter((description) => description.closest("aria-popover-content") === content)
    .map((description) => description.hasAttribute("native-composition") && description.firstElementChild instanceof HTMLElement
      ? description.firstElementChild
      : description);
}

export function ensurePopoverId(element: HTMLElement, part: string) {
  if (!element.id) element.id = `ariaui-popover-${part}-${++popoverId}`;
  return element.id;
}

export function booleanAttribute(element: Element, name: string, fallback: boolean) {
  const value = element.getAttribute(name);
  return value == null ? fallback : value !== "false";
}

export function popoverPlacement(root: Element) {
  return root.getAttribute("placement") ?? "bottom";
}

export function popoverOffset(root: Element) {
  const value = Number(root.getAttribute("offset") ?? "10");
  return Number.isFinite(value) ? value : 10;
}

export function popoverTabbables(container: Element) {
  return Array.from(container.querySelectorAll<HTMLElement>(
    "button, [href], input, select, textarea, aria-popover-close, [tabindex]:not([tabindex='-1'])",
  )).filter((element) => !element.hidden && !element.hasAttribute("disabled") && !("disabled" in element && Boolean((element as HTMLButtonElement).disabled)));
}
