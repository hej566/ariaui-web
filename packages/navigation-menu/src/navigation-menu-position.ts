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

function setStyle(element: HTMLElement, property: "left" | "maxWidth" | "position" | "top" | "visibility", value: string) {
  if (element.style[property] !== value) element.style[property] = value;
}

function setHidden(element: HTMLElement, value: boolean) {
  if (element.hidden !== value) element.hidden = value;
}

function absoluteStyleCoordinates(element: HTMLElement, position: Pick<NavigationMenuPosition, "left" | "top">) {
  const offsetParent = element.offsetParent;
  if (offsetParent instanceof HTMLElement) {
    const parentRect = offsetParent.getBoundingClientRect();
    return {
      left: position.left - parentRect.left + offsetParent.scrollLeft - offsetParent.clientLeft,
      top: position.top - parentRect.top + offsetParent.scrollTop - offsetParent.clientTop,
    };
  }

  const view = element.ownerDocument.defaultView;
  const scroller = element.ownerDocument.scrollingElement;
  return {
    left: position.left + (view?.scrollX ?? scroller?.scrollLeft ?? 0),
    top: position.top + (view?.scrollY ?? scroller?.scrollTop ?? 0),
  };
}

function applyPosition(element: HTMLElement, position: NavigationMenuPosition) {
  const coordinates = absoluteStyleCoordinates(element, position);
  setStyle(element, "position", "absolute");
  setStyle(element, "left", `${coordinates.left}px`);
  setStyle(element, "top", `${coordinates.top}px`);
  setStyle(element, "visibility", "visible");
  if (element.dataset.side !== position.side) element.dataset.side = position.side;
  if (element.dataset.align !== position.align) element.dataset.align = position.align;
}

function contentAnchorLeft(
  reference: Pick<DOMRect, "left">,
  boundary: { width: number },
) {
  return clamp(reference.left, viewportPadding, boundary.width - viewportPadding);
}

function referenceOutsideViewport(
  reference: Pick<DOMRect, "bottom" | "left" | "right" | "top">,
  boundary: { width: number; height: number },
) {
  return reference.bottom <= 0
    || reference.top >= boundary.height
    || reference.right <= 0
    || reference.left >= boundary.width;
}

function applyFloatingConstraints(
  element: HTMLElement,
  reference: Pick<DOMRect, "bottom" | "left" | "right" | "top">,
  boundary: { width: number; height: number },
  kind: "content" | "subcontent",
) {
  if (kind !== "content" || referenceOutsideViewport(reference, boundary)) {
    setStyle(element, "maxWidth", "");
    return;
  }

  const availableWidth = Math.max(0, boundary.width - contentAnchorLeft(reference, boundary) - viewportPadding);
  setStyle(element, "maxWidth", `${availableWidth}px`);
}

export function computeNavigationMenuPosition(
  reference: Pick<DOMRect, "bottom" | "left" | "right" | "top">,
  floating: { width: number; height: number },
  boundary: { width: number; height: number },
  kind: "content" | "subcontent",
): NavigationMenuPosition {
  if (referenceOutsideViewport(reference, boundary)) {
    return kind === "subcontent"
      ? {
          align: "start",
          left: reference.right + subContentOffset,
          side: "right",
          top: reference.top - 4,
        }
      : {
          align: "start",
          left: reference.left,
          side: "bottom",
          top: reference.bottom + contentOffset,
        };
  }

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
    left: contentAnchorLeft(reference, boundary),
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
  const referenceRect = reference.getBoundingClientRect();
  const boundary = viewport(content);
  applyFloatingConstraints(content, referenceRect, boundary, kind);
  applyPosition(content, computeNavigationMenuPosition(
    referenceRect,
    floatingSize(content),
    boundary,
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
  setStyle(content, "position", "absolute");
  setHidden(content, false);
  const update = () => updateNavigationMenuPosition(reference, content, kind);
  update();
  const cleanup = autoUpdate(reference, content, update, () => undefined);
  if (cleanup) cleanups.set(content, cleanup);
}
