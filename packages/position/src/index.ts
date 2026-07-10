export type Placement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end"
  | "auto"
  | string;

export type PositionOffset =
  | number
  | { mainAxis?: number; crossAxis?: number; x?: number; y?: number };

export type PositionBoundary = Element | DOMRect | "viewport";

export interface Options {
  placement?: Placement;
  strategy?: "absolute" | "fixed";
  offset?: PositionOffset;
  boundary?: PositionBoundary;
}

export interface Return {
  x: number;
  y: number;
  placement: string;
  strategy: string;
  rects: {
    reference: DOMRect;
    floating: DOMRect;
  };
}

export type DetectOverflowOptions = {
  boundary?: DOMRect;
  padding?: number;
};

type ReferenceElement =
  | Element
  | { getBoundingClientRect: () => DOMRect; contextElement?: Element }
  | null;

export type PrePositionAnchorCorner = "always" | "while-hidden" | "never";

export type PrePositionStyle = {
  position: "absolute";
  top?: number;
  left?: number;
  visibility?: "visible" | "hidden";
};

export function getWindow(node?: Element | Document | Window) {
  if (!node) return typeof window !== "undefined" ? window : undefined;
  return (
    (node as { ownerDocument?: Document }).ownerDocument?.defaultView ||
    (node as Document).defaultView ||
    (typeof window !== "undefined" ? window : undefined)
  );
}

export function getDPR(element?: Element | null) {
  const win =
    (element && element.ownerDocument && element.ownerDocument.defaultView) ||
    (typeof window !== "undefined" ? window : undefined);
  return (win && win.devicePixelRatio) || 1;
}

export function roundByDPR(element: Element | null, value: number) {
  const dpr = getDPR(element);
  return Math.round(value * dpr) / dpr;
}

export function isNode(value: unknown): value is Node {
  return value != null && typeof (value as Node).nodeType === "number";
}

export function isElement(value: unknown): value is Element {
  return isNode(value) && (value as Node).nodeType === 1;
}

export function isShadowRoot(value: unknown): value is ShadowRoot {
  return (
    isNode(value) &&
    (value as Node).nodeType === 11 &&
    "host" in (value as object)
  );
}

export function getDocument(node: Node | null | undefined): Document {
  return node?.ownerDocument || document;
}

export function getComputedStyleSafe(el: Element): CSSStyleDeclaration {
  const win = getWindow(el);
  return win ? win.getComputedStyle(el) : ({} as CSSStyleDeclaration);
}

export function isOverflowing(style: CSSStyleDeclaration) {
  const overflowRegex = /(auto|scroll|hidden)/;
  return overflowRegex.test(style.overflow + style.overflowX + style.overflowY);
}

export function getOverflowAncestors(element: Element) {
  const ancestors: Element[] = [];
  const visited = new Set<Node>();

  function nextAncestor(node: Element): Node | null {
    if (node.parentElement) return node.parentElement;
    if (typeof node.getRootNode !== "function") return null;
    const root = node.getRootNode();
    if (root === node) return null;
    return root;
  }

  let current: Node | null = nextAncestor(element);

  while (current && !visited.has(current)) {
    visited.add(current);

    if (isShadowRoot(current)) {
      current = current.host;
      continue;
    }

    if (!isElement(current)) break;

    if (current.nodeName === "HTML") {
      ancestors.push(current);
      break;
    }

    try {
      const style = getComputedStyleSafe(current);
      if (isOverflowing(style)) ancestors.push(current);
    } catch (error) {
      console.error(error);
    }

    current = nextAncestor(current);
  }

  return ancestors;
}

export function getRect(
  elementOrVirtual:
    | Element
    | { getBoundingClientRect: () => DOMRect }
    | null
    | undefined,
): DOMRect {
  if (!elementOrVirtual) return new DOMRect(0, 0, 0, 0);
  if (isElement(elementOrVirtual)) return elementOrVirtual.getBoundingClientRect();
  if (typeof elementOrVirtual.getBoundingClientRect === "function") {
    return elementOrVirtual.getBoundingClientRect();
  }
  return new DOMRect(0, 0, 0, 0);
}

function getViewportRect(
  element:
    | Element
    | { getBoundingClientRect: () => DOMRect }
    | null
    | undefined,
): DOMRect {
  const doc = isElement(element) ? getDocument(element) : document;
  const win = getWindow(doc);
  const width = doc.documentElement.clientWidth || win?.innerWidth || 0;
  const height = doc.documentElement.clientHeight || win?.innerHeight || 0;

  return new DOMRect(0, 0, width, height);
}

export function getClippingRect(
  element:
    | Element
    | { getBoundingClientRect: () => DOMRect }
    | null
    | undefined,
  explicitBoundary?: PositionBoundary,
): DOMRect {
  if (explicitBoundary === "viewport") return getViewportRect(element);
  if (explicitBoundary instanceof DOMRect) return explicitBoundary;
  if (isElement(explicitBoundary)) return explicitBoundary.getBoundingClientRect();

  const doc = isElement(element) ? getDocument(element) : document;
  const win = getWindow(doc);
  let left = -1;
  let top = -1;
  let right = doc.documentElement.clientWidth || win?.innerWidth || 0;
  let bottom = doc.documentElement.clientHeight || win?.innerHeight || 0;

  if (isElement(element)) {
    const ancestors = getOverflowAncestors(element);
    for (const ancestor of ancestors) {
      if (ancestor === doc.documentElement) continue;

      const rect = ancestor.getBoundingClientRect();
      left = Math.max(left, rect.left);
      top = Math.max(top, rect.top);
      right = Math.min(right, rect.right);
      bottom = Math.min(bottom, rect.bottom);
    }
  }

  return new DOMRect(
    left,
    top,
    Math.max(-1, right - left),
    Math.max(0, bottom - top),
  );
}

export function fitsWithinRect(
  x: number,
  y: number,
  floatingRect: DOMRect,
  boundary: DOMRect,
) {
  return (
    x >= boundary.left &&
    y >= boundary.top &&
    x + floatingRect.width <= boundary.right &&
    y + floatingRect.height <= boundary.bottom
  );
}

export function detectOverflow(
  element: Element,
  options: DetectOverflowOptions = {},
) {
  const padding = options.padding || 0;
  const elementRect = getRect(element);
  const clippingRect = options.boundary || getClippingRect(element);

  return {
    top: clippingRect.top - elementRect.top + padding,
    bottom: elementRect.bottom - clippingRect.bottom + padding,
    left: clippingRect.left - elementRect.left + padding,
    right: elementRect.right - clippingRect.right + padding,
  };
}

export function computeCoordsFromPlacement(
  referenceRect: DOMRect,
  floatingRect: DOMRect,
  placement: string,
  options: { offset?: PositionOffset } = {},
) {
  const [side, alignment] = placement.split("-");
  let x = 0;
  let y = 0;

  switch (side) {
    case "top":
      x = referenceRect.left + (referenceRect.width - floatingRect.width) / 2;
      y = referenceRect.top - floatingRect.height;
      break;
    case "bottom":
      x = referenceRect.left + (referenceRect.width - floatingRect.width) / 2;
      y = referenceRect.bottom;
      break;
    case "left":
      x = referenceRect.left - floatingRect.width;
      y = referenceRect.top + (referenceRect.height - floatingRect.height) / 2;
      break;
    case "right":
      x = referenceRect.right;
      y = referenceRect.top + (referenceRect.height - floatingRect.height) / 2;
      break;
    default:
      x = referenceRect.left + (referenceRect.width - floatingRect.width) / 2;
      y = referenceRect.bottom;
  }

  if (side === "top" || side === "bottom") {
    if (alignment === "start") {
      x = referenceRect.left;
    } else if (alignment === "end") {
      x = referenceRect.right - floatingRect.width;
    }
  } else if (side === "left" || side === "right") {
    if (alignment === "start") {
      y = referenceRect.top;
    } else if (alignment === "end") {
      y = referenceRect.bottom - floatingRect.height;
    }
  }

  if (options.offset) {
    const mainAxis =
      typeof options.offset === "number"
        ? options.offset
        : options.offset.mainAxis || 0;
    const crossAxis =
      typeof options.offset === "number" ? 0 : options.offset.crossAxis || 0;

    if (side === "top") {
      y -= mainAxis;
      x += crossAxis;
    } else if (side === "bottom") {
      y += mainAxis;
      x += crossAxis;
    } else if (side === "left") {
      x -= mainAxis;
      y += crossAxis;
    } else if (side === "right") {
      x += mainAxis;
      y += crossAxis;
    }

    if (typeof options.offset === "object") {
      x += options.offset.x || 0;
      y += options.offset.y || 0;
    }
  }

  return { x, y };
}

function flipCoords(
  referenceRect: DOMRect,
  floatingRect: DOMRect,
  placement: string,
  options: Options = {},
  boundary: DOMRect,
  coords: { x: number; y: number },
) {
  void boundary;
  void coords;
  const [side, alignment] = placement.split("-");
  let flip = "";

  if (side === "top") flip = "bottom";
  else if (side === "bottom") flip = "top";
  else if (side === "left") flip = "right";
  else if (side === "right") flip = "left";

  if (!flip) return { placement, coords };

  const flippedPlacement = alignment ? flip + "-" + alignment : flip;
  let flippedOptions = options;

  if (typeof options.offset === "object") {
    flippedOptions = { ...options, offset: { ...options.offset } };
    const offset = flippedOptions.offset as { x?: number; y?: number };

    if ((side === "top" || side === "bottom") && offset.y !== undefined) {
      offset.y = -offset.y;
    }
    if ((side === "left" || side === "right") && offset.x !== undefined) {
      offset.x = -offset.x;
    }
  }

  const flippedCoords = computeCoordsFromPlacement(
    referenceRect,
    floatingRect,
    flippedPlacement,
    flippedOptions,
  );

  return { placement: flippedPlacement, coords: flippedCoords };
}

function hasMainAxisOverflow(
  placement: string,
  floatingRect: DOMRect,
  boundary: DOMRect,
  coords: { x: number; y: number },
) {
  const [side] = placement.split("-");

  if (side === "top" || side === "bottom") {
    return (
      coords.y < boundary.top ||
      coords.y + floatingRect.height > boundary.bottom
    );
  }

  if (side === "left" || side === "right") {
    return (
      coords.x < boundary.left ||
      coords.x + floatingRect.width > boundary.right
    );
  }

  return false;
}

function updateCoords(
  coords: { x: number; y: number },
  floating: Element,
): { x: number; y: number } {
  if (!isElement(floating)) return coords;

  const offsetParent = (floating as HTMLElement).offsetParent as HTMLElement | null;
  const isBody =
    offsetParent &&
    (offsetParent.nodeName === "BODY" || offsetParent.nodeName === "HTML");
  let isRoot = !offsetParent;

  if (isBody && offsetParent) {
    const style = getComputedStyleSafe(offsetParent);
    if (style.position === "static") {
      isRoot = true;
    }
  }

  if (isRoot) {
    const win = getWindow(floating);
    coords.x += win?.scrollX || 0;
    coords.y += win?.scrollY || 0;
  } else if (offsetParent) {
    const parentRect = offsetParent.getBoundingClientRect();
    const parentStyle = getComputedStyleSafe(offsetParent);
    coords.x -=
      parentRect.left + (parseFloat(parentStyle.borderLeftWidth) || 0);
    coords.y -=
      parentRect.top + (parseFloat(parentStyle.borderTopWidth) || 0);
  }

  return coords;
}

export function computePosition(
  reference: Element | { getBoundingClientRect: () => DOMRect } | null,
  floating: Element,
  options: Options = {},
): Return {
  const strategy = options.strategy || "absolute";
  const referenceRect = getRect(reference);
  const floatingRect = getRect(floating);
  const boundary = getClippingRect(reference, options.boundary);

  let placement = options.placement || "bottom";
  let coords = computeCoordsFromPlacement(
    referenceRect,
    floatingRect,
    placement,
    options,
  );

  if (
    boundary.width > 0 &&
    boundary.height > 0 &&
    hasMainAxisOverflow(placement, floatingRect, boundary, coords)
  ) {
    const computed = flipCoords(
      referenceRect,
      floatingRect,
      placement,
      options,
      boundary,
      coords,
    );
    placement = computed.placement;
    coords = computed.coords;
  }

  if (strategy === "absolute") {
    coords = updateCoords(coords, floating);
  }

  const round = (value: number) => roundByDPR(
    isElement(floating) ? floating : null,
    value,
  );

  return {
    x: round(coords.x),
    y: round(coords.y),
    placement,
    strategy,
    rects: {
      reference: referenceRect,
      floating: floatingRect,
    },
  };
}

function getReferenceElement(reference: ReferenceElement) {
  if (!reference) return null;
  return isElement(reference) ? reference : reference.contextElement ?? null;
}

function getAncestorChain(node: Node) {
  const chain: Node[] = [];
  let current: Node | null = node;

  while (current) {
    chain.push(current);
    current = current.parentNode;
  }

  return chain;
}

function normalizeMutationTarget(target: Node) {
  if (target.nodeType === Node.DOCUMENT_NODE) {
    return (target as Document).documentElement ?? target;
  }

  return target;
}

function getNearestSharedAncestor(first: Node, second: Node) {
  const firstAncestors = new Set(getAncestorChain(first));

  for (const ancestor of getAncestorChain(second)) {
    if (firstAncestors.has(ancestor)) {
      return normalizeMutationTarget(ancestor);
    }
  }

  return null;
}

function getMutationObserverTarget(reference: ReferenceElement, floating: Element) {
  const refElement = getReferenceElement(reference);
  const fallbackTarget =
    floating.ownerDocument?.documentElement ?? document.documentElement;
  if (!refElement) {
    return normalizeMutationTarget(floating.parentNode ?? fallbackTarget);
  }

  return (
    getNearestSharedAncestor(refElement, floating) ??
    normalizeMutationTarget(fallbackTarget)
  );
}

export function autoUpdate(
  reference: ReferenceElement,
  floating: Element | null,
  update: () => void,
  hide: () => void,
  options?: { ancestorScroll?: boolean },
) {
  if (!reference || !floating) return;
  void hide;

  const ancestorScroll = options?.ancestorScroll !== false;
  const listeners: Array<() => void> = [];
  let rafId: number | undefined;

  function scheduledUpdate(
    _event:
      | Event
      | ResizeObserverEntry[]
      | MutationRecord[]
      | IntersectionObserverEntry[],
  ) {
    if (rafId !== undefined) return;
    rafId = requestAnimationFrame(() => {
      rafId = undefined;
      update();
    });
  }

  const win = getWindow(floating) || window;
  const scrollAncestors = new Set<Element>();

  if (ancestorScroll) {
    try {
      const refElement = getReferenceElement(reference);
      if (refElement) {
        getOverflowAncestors(refElement).forEach((ancestor) =>
          scrollAncestors.add(ancestor),
        );
      }
      getOverflowAncestors(floating).forEach((ancestor) =>
        scrollAncestors.add(ancestor),
      );
    } catch (error) {
      console.error(error);
    }

    scrollAncestors.forEach((element) => {
      element.addEventListener("scroll", scheduledUpdate, { passive: true });
      listeners.push(() => element.removeEventListener("scroll", scheduledUpdate));
    });

    win.addEventListener("scroll", scheduledUpdate, { passive: true });
    listeners.push(() => win.removeEventListener("scroll", scheduledUpdate));
  }

  win.addEventListener("resize", scheduledUpdate);
  listeners.push(() => win.removeEventListener("resize", scheduledUpdate));

  let resizeObserver: ResizeObserver | undefined;
  let mutationObserver: MutationObserver | undefined;
  let intersectionObserver: IntersectionObserver | undefined;

  if (win.ResizeObserver) {
    resizeObserver = new win.ResizeObserver(scheduledUpdate);
  }
  if (win.MutationObserver) {
    mutationObserver = new win.MutationObserver(scheduledUpdate);
  }
  if (win.IntersectionObserver) {
    intersectionObserver = new win.IntersectionObserver(scheduledUpdate);
  }

  try {
    if (isElement(reference)) resizeObserver?.observe(reference);
    if (isElement(floating)) resizeObserver?.observe(floating);
    if (isElement(reference)) intersectionObserver?.observe(reference);
    const mutationTarget = getMutationObserverTarget(reference, floating);
    mutationObserver?.observe(mutationTarget, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  } catch (error) {
    console.error(error);
  }

  listeners.push(() => resizeObserver?.disconnect());
  listeners.push(() => mutationObserver?.disconnect());
  listeners.push(() => intersectionObserver?.disconnect());

  return function cleanup() {
    if (rafId !== undefined) cancelAnimationFrame(rafId);
    for (const remove of listeners) remove();
  };
}

function measureFloating<T>(floating: HTMLElement, measure: () => T) {
  const isDisplayNone = getComputedStyle(floating).display === "none";

  if (!isDisplayNone) {
    return measure();
  }

  const previousDisplay = floating.style.display;
  const previousVisibility = floating.style.visibility;

  floating.style.display = "block";
  floating.style.visibility = "hidden";

  try {
    return measure();
  } finally {
    floating.style.display = previousDisplay;
    floating.style.visibility = previousVisibility;
  }
}

export function createUpdateEffect({
  reference,
  floating,
  placement,
  offset,
  boundary,
}: {
  reference: HTMLElement | null;
  floating: HTMLElement | null;
  placement: NonNullable<Options["placement"]>;
  offset?: Options["offset"];
  boundary?: Options["boundary"];
}) {
  return () => {
    if (!floating || !reference) return;
    const result = measureFloating(floating, () =>
      computePosition(reference, floating, {
        placement,
        ...(offset !== undefined ? { offset } : {}),
        ...(boundary !== undefined ? { boundary } : {}),
        strategy: "absolute",
      }),
    );

    floating.style.left = String(result.x) + "px";
    floating.style.top = String(result.y) + "px";
    floating.style.position = result.strategy;
    floating.dataset.side =
      result.placement.split("-")[0] ?? placement.split("-")[0] ?? "bottom";
  };
}

export function createHideEffect({
  floating,
}: {
  floating: HTMLElement | null;
}) {
  return () => {
    if (!floating) return;
    floating.style.display = "none";
  };
}

export function computePrePositionStyle(
  positioned: boolean,
  anchorCorner: PrePositionAnchorCorner,
): PrePositionStyle {
  const style: PrePositionStyle = {
    position: "absolute",
  };

  const useTopLeft =
    anchorCorner === "always" ||
    (!positioned && anchorCorner === "while-hidden");

  if (useTopLeft) {
    style.top = 0;
    style.left = 0;
  }

  style.visibility = positioned ? "visible" : "hidden";

  return style;
}

export { componentSpec } from "./component-spec";
