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

const hoverCardContentRoots = new WeakMap<Element, HTMLElement>();
const hoverCardRootContents = new WeakMap<Element, HTMLElement>();

export function hoverCardPartName(element: HTMLElement) {
  return (
    (element.constructor as typeof HTMLElement & { partName?: string })
      .partName ?? ""
  );
}

export function hoverCardRoot(element: Element) {
  if (element.matches("aria-hover-card")) {
    return element as HTMLElement;
  }

  const localRoot = element.closest("aria-hover-card") as HTMLElement | null;
  if (localRoot) {
    return localRoot;
  }

  const content = element.matches("aria-hover-card-content")
    ? element
    : element.closest("aria-hover-card-content");
  return content ? hoverCardContentRoots.get(content) ?? null : null;
}

export function registerHoverCardContent(root: HTMLElement, content: HTMLElement) {
  hoverCardRootContents.set(root, content);
  hoverCardContentRoots.set(content, root);
}

export function hoverCardRootOwnsNode(root: HTMLElement, node: Node) {
  if (root.contains(node)) {
    return true;
  }

  return hoverCardRootContents.get(root)?.contains(node) === true;
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
    hoverCardRootContents.get(root) ??
    Array.from(
      root.querySelectorAll<HTMLElement>("aria-hover-card-content"),
    ).find((element) => element.closest("aria-hover-card") === root) ??
    null
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
