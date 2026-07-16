export type ContextMenuPosition = {
  align: "start";
  left: number;
  side: "top" | "right" | "bottom" | "left";
  top: number;
};

export type ContextMenuRect = Pick<DOMRect, "bottom" | "height" | "left" | "right" | "top" | "width">;

function viewportSize(ownerDocument: Document) {
  const view = ownerDocument.defaultView;
  return {
    width: ownerDocument.documentElement.clientWidth || view?.innerWidth || 0,
    height: ownerDocument.documentElement.clientHeight || view?.innerHeight || 0,
  };
}

function elementSize(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
}

function parseOffset(element: HTMLElement) {
  const rawOffset = element.getAttribute("offset");
  if (!rawOffset) {
    return { x: 0, y: 0 };
  }

  const [rawX = "0", rawY = rawX] = rawOffset.split(/[\s,]+/);
  return {
    x: Number.parseFloat(rawX) || 0,
    y: Number.parseFloat(rawY) || 0,
  };
}

function applyPosition(element: HTMLElement, position: ContextMenuPosition) {
  element.style.position = "fixed";
  element.style.left = position.left + "px";
  element.style.top = position.top + "px";
  element.style.display = "";
  element.style.visibility = "visible";
  element.dataset.side = position.side;
  element.dataset.align = position.align;
}

export function computeContextMenuPosition(
  point: { x: number; y: number },
  floatingSize: { width: number; height: number },
  viewport: { width: number; height: number },
  offset = { x: 0, y: 0 },
): ContextMenuPosition {
  const bottomTop = point.y + offset.y;
  const overflowsBottom = bottomTop + floatingSize.height > viewport.height;
  const side = overflowsBottom ? "top" : "bottom";
  const top = side === "top" ? Math.max(0, point.y - floatingSize.height - offset.y) : bottomTop;
  const preferredLeft = point.x + offset.x;
  const maxLeft = Math.max(0, viewport.width - floatingSize.width);
  const left = Math.min(Math.max(0, preferredLeft), maxLeft);

  return { align: "start", left, side, top };
}

export function computeContextMenuSubPosition(
  referenceRect: ContextMenuRect,
  floatingSize: { width: number; height: number },
  viewport: { width: number; height: number },
  offset = { x: 0, y: 0 },
): ContextMenuPosition {
  const rightLeft = referenceRect.right + offset.x;
  const overflowsRight = rightLeft + floatingSize.width > viewport.width;
  const side = overflowsRight ? "left" : "right";
  const left = side === "left"
    ? Math.max(0, referenceRect.left - floatingSize.width - offset.x)
    : rightLeft;
  const maxTop = Math.max(0, viewport.height - floatingSize.height);
  const top = Math.min(Math.max(0, referenceRect.top + offset.y), maxTop);

  return { align: "start", left, side, top };
}

export function positionContextMenuContent(content: HTMLElement, point: { x: number; y: number }, offset = parseOffset(content)) {
  applyPosition(content, computeContextMenuPosition(point, elementSize(content), viewportSize(content.ownerDocument), offset));
}

export function positionContextMenuSubContent(trigger: HTMLElement, content: HTMLElement, offset = parseOffset(content.closest("aria-context-menu-sub") as HTMLElement ?? content)) {
  applyPosition(content, computeContextMenuSubPosition(trigger.getBoundingClientRect(), elementSize(content), viewportSize(content.ownerDocument), offset));
}
