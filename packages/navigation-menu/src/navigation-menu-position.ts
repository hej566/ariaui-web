import { autoUpdate } from "@ariaui-web/position";

export type NavigationMenuPosition = {
  align: "start";
  left: number;
  side: "top" | "right" | "bottom" | "left";
  top: number;
};

const cleanups = new WeakMap<HTMLElement, () => void>();
const contentOffset = 5;
const subContentOffset = 2;
const viewportPadding = 8;

function clamp(value: number, min: number, max: number) {
  return max < min ? min : Math.min(Math.max(value, min), max);
}

function viewport(element: HTMLElement) {
  const view = element.ownerDocument.defaultView;
  return {
    width: view?.innerWidth ?? element.ownerDocument.documentElement.clientWidth,
    height: view?.innerHeight ?? element.ownerDocument.documentElement.clientHeight,
  };
}

function floatingSize(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    width: Math.max(rect.width, element.offsetWidth, element.scrollWidth),
    height: Math.max(rect.height, element.offsetHeight, element.scrollHeight),
  };
}

function setStyle(element: HTMLElement, property: "left" | "position" | "top" | "visibility", value: string) {
  if (element.style[property] !== value) element.style[property] = value;
}

function setHidden(element: HTMLElement, value: boolean) {
  if (element.hidden !== value) element.hidden = value;
}

function applyPosition(element: HTMLElement, position: NavigationMenuPosition) {
  setStyle(element, "position", "fixed");
  setStyle(element, "left", `${position.left}px`);
  setStyle(element, "top", `${position.top}px`);
  setStyle(element, "visibility", "visible");
  if (element.dataset.side !== position.side) element.dataset.side = position.side;
  if (element.dataset.align !== position.align) element.dataset.align = position.align;
}

export function computeNavigationMenuPosition(
  reference: Pick<DOMRect, "bottom" | "left" | "right" | "top">,
  floating: { width: number; height: number },
  boundary: { width: number; height: number },
  kind: "content" | "subcontent",
): NavigationMenuPosition {
  if (kind === "subcontent") {
    const right = reference.right + subContentOffset;
    const side = right + floating.width > boundary.width - viewportPadding ? "left" : "right";
    return {
      align: "start",
      left: side === "left" ? reference.left - floating.width - subContentOffset : right,
      side,
      top: clamp(reference.top - 4, viewportPadding, boundary.height - floating.height - viewportPadding),
    };
  }

  const side = reference.bottom + contentOffset + floating.height > boundary.height - viewportPadding
    ? "top"
    : "bottom";

  return {
    align: "start",
    left: clamp(reference.left, viewportPadding, boundary.width - floating.width - viewportPadding),
    side,
    top: clamp(
      side === "top"
        ? reference.top - contentOffset - floating.height
        : reference.bottom + contentOffset,
      viewportPadding,
      boundary.height - floating.height - viewportPadding,
    ),
  };
}

function updateNavigationMenuPosition(reference: HTMLElement, content: HTMLElement, kind: "content" | "subcontent") {
  if (!reference.isConnected || !content.isConnected || content.hidden) return;
  applyPosition(content, computeNavigationMenuPosition(
    reference.getBoundingClientRect(),
    floatingSize(content),
    viewport(content),
    kind,
  ));
}

export function stopNavigationMenuPositioning(content: HTMLElement) {
  cleanups.get(content)?.();
  cleanups.delete(content);
}

export function positionNavigationMenuContent(reference: HTMLElement, content: HTMLElement, kind: "content" | "subcontent") {
  stopNavigationMenuPositioning(content);
  const opening = content.hidden || content.style.visibility !== "visible";
  if (opening) setStyle(content, "visibility", "hidden");
  setStyle(content, "position", "fixed");
  setHidden(content, false);
  const update = () => updateNavigationMenuPosition(reference, content, kind);
  update();
  const cleanup = autoUpdate(reference, content, update, () => undefined);
  if (cleanup) cleanups.set(content, cleanup);
}
