export type HoverCardPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end";

const placements = new Set<HoverCardPlacement>([
  "top",
  "top-start",
  "top-end",
  "right",
  "right-start",
  "right-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
]);

let hoverCardId = 0;

export function hoverCardPartName(element: HTMLElement) {
  return (
    (element.constructor as typeof HTMLElement & { partName?: string })
      .partName ?? ""
  );
}

export function hoverCardRoot(element: Element) {
  return element.matches("aria-hover-card")
    ? (element as HTMLElement)
    : (element.closest("aria-hover-card") as HTMLElement | null);
}

export function hoverCardTrigger(root: Element) {
  return (
    Array.from(
      root.querySelectorAll<HTMLElement>("aria-hover-card-trigger"),
    ).find((element) => element.closest("aria-hover-card") === root) ?? null
  );
}

export function hoverCardContent(root: Element) {
  return (
    Array.from(
      root.querySelectorAll<HTMLElement>("aria-hover-card-content"),
    ).find((element) => element.closest("aria-hover-card") === root) ?? null
  );
}

export function ensureHoverCardId(
  element: HTMLElement,
  suffix: "trigger" | "content",
) {
  if (!element.id) {
    hoverCardId += 1;
    element.id = `aria-hover-card-${hoverCardId}-${suffix}`;
  }
  return element.id;
}

export function hoverCardPlacement(root: Element): HoverCardPlacement {
  const value = root.getAttribute("placement") as HoverCardPlacement | null;
  return value && placements.has(value) ? value : "bottom";
}

export function hoverCardOffset(root: Element) {
  const value = Number(root.getAttribute("offset") ?? "8");
  return Number.isFinite(value) ? value : 8;
}

export function assertHoverCardStructure(element: HTMLElement) {
  const part = hoverCardPartName(element);
  if ((part === "Trigger" || part === "Content") && !hoverCardRoot(element)) {
    throw new Error(
      "HoverCard components must be wrapped in <HoverCard.Root />",
    );
  }
}
