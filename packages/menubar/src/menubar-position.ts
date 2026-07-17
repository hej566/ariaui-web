import { autoUpdate } from "@ariaui-web/position";

export type MenubarPosition = { align: "start"; left: number; side: "top" | "right" | "bottom" | "left"; top: number };

const cleanups = new WeakMap<HTMLElement, () => void>();
const contentOffset = 5;
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

function applyPosition(element: HTMLElement, position: MenubarPosition) {
  setStyle(element, "position", "fixed");
  setStyle(element, "left", `${position.left}px`);
  setStyle(element, "top", `${position.top}px`);
  setStyle(element, "visibility", "visible");
  if (element.dataset.side !== position.side) element.dataset.side = position.side;
  if (element.dataset.align !== position.align) element.dataset.align = position.align;
}

export function computeMenubarPosition(
  reference: Pick<DOMRect, "bottom" | "left" | "right" | "top">,
  floating: { width: number; height: number },
  boundary: { width: number; height: number },
  kind: "content" | "subcontent",
): MenubarPosition {
  if (kind === "subcontent") {
    const right = reference.right + 2;
    const side = right < 0 || right + floating.width > boundary.width ? "left" : "right";
    return {
      align: "start",
      left: side === "left" ? reference.left - floating.width - 2 : right,
      side,
      top: reference.top - 4,
    };
  }

  const belowSpace = boundary.height - reference.bottom - viewportPadding;
  const aboveSpace = reference.top - viewportPadding;
  const side = reference.bottom + contentOffset + floating.height > boundary.height - viewportPadding
    && aboveSpace >= belowSpace
    ? "top"
    : "bottom";
  return {
    align: "start",
    left: clamp(reference.left, viewportPadding, boundary.width - floating.width - viewportPadding),
    side,
    top: side === "top"
      ? reference.top - contentOffset - floating.height
      : reference.bottom + contentOffset,
  };
}

function updateMenubarPosition(reference: HTMLElement, content: HTMLElement, kind: "content" | "subcontent") {
  if (!reference.isConnected || !content.isConnected || content.hidden) return;
  applyPosition(content, computeMenubarPosition(
    reference.getBoundingClientRect(),
    floatingSize(content),
    viewport(content),
    kind,
  ));
}

export function stopMenubarPositioning(content: HTMLElement) {
  cleanups.get(content)?.();
  cleanups.delete(content);
}

export function positionMenubarContent(reference: HTMLElement, content: HTMLElement, kind: "content" | "subcontent") {
  stopMenubarPositioning(content);
  setStyle(content, "visibility", "hidden");
  setStyle(content, "position", "fixed");
  content.hidden = false;
  const update = () => updateMenubarPosition(reference, content, kind);
  update();
  const cleanup = autoUpdate(reference, content, update, () => undefined);
  if (cleanup) cleanups.set(content, cleanup);
}
