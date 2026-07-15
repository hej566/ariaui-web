import {
  hoverCardContent,
  hoverCardOffset,
  hoverCardPlacement,
  hoverCardTrigger,
  type HoverCardPlacement,
} from "./hover-card-dom";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";
type AutoState = { cleanup: (() => void) | null };

const autoStates = new WeakMap<HTMLElement, AutoState>();

function splitPlacement(value: HoverCardPlacement): [Side, Align] {
  const [side, align = "center"] = value.split("-") as [Side, Align?];
  return [side, align];
}

function opposite(side: Side): Side {
  return { top: "bottom", right: "left", bottom: "top", left: "right" }[
    side
  ] as Side;
}

function coordinates(
  side: Side,
  align: Align,
  reference: DOMRect,
  floating: DOMRect,
  offset: number,
) {
  let x = reference.left + (reference.width - floating.width) / 2;
  let y = reference.top + (reference.height - floating.height) / 2;
  if (side === "top") y = reference.top - floating.height - offset;
  if (side === "bottom") y = reference.bottom + offset;
  if (side === "left") x = reference.left - floating.width - offset;
  if (side === "right") x = reference.right + offset;
  if ((side === "top" || side === "bottom") && align === "start")
    x = reference.left;
  if ((side === "top" || side === "bottom") && align === "end") {
    x = reference.right - floating.width;
  }
  if ((side === "left" || side === "right") && align === "start")
    y = reference.top;
  if ((side === "left" || side === "right") && align === "end") {
    y = reference.bottom - floating.height;
  }
  return { x, y };
}

function mainAxisOverflow(
  side: Side,
  point: { x: number; y: number },
  rect: DOMRect,
  width: number,
  height: number,
) {
  if (side === "top") return point.y < 0;
  if (side === "bottom") return point.y + rect.height > height;
  if (side === "left") return point.x < 0;
  return point.x + rect.width > width;
}

function positionArrow(content: HTMLElement, floating: DOMRect, side: Side) {
  const arrow = content.querySelector<HTMLElement>("[data-hover-card-arrow]");
  if (!arrow) return;

  const arrowRect = arrow.getBoundingClientRect();
  const arrowWidth = arrow.offsetWidth || arrowRect.width || 8;
  const arrowHeight = arrow.offsetHeight || arrowRect.height || 8;
  const horizontalCenter = Math.round((floating.width - arrowWidth) / 2);
  const verticalCenter = Math.round((floating.height - arrowHeight) / 2);

  arrow.style.position = "absolute";
  arrow.style.left = "auto";
  arrow.style.right = "auto";
  arrow.style.top = "auto";
  arrow.style.bottom = "auto";

  if (side === "top") {
    arrow.style.bottom = `${Math.round(-arrowHeight / 2)}px`;
    arrow.style.left = `${horizontalCenter}px`;
  } else if (side === "bottom") {
    arrow.style.top = `${Math.round(-arrowHeight / 2)}px`;
    arrow.style.left = `${horizontalCenter}px`;
  } else if (side === "left") {
    arrow.style.right = `${Math.round(-arrowWidth / 2)}px`;
    arrow.style.top = `${verticalCenter}px`;
  } else {
    arrow.style.left = `${Math.round(-arrowWidth / 2)}px`;
    arrow.style.top = `${verticalCenter}px`;
  }
}

export function positionHoverCard(root: HTMLElement) {
  const trigger = hoverCardTrigger(root);
  const content = hoverCardContent(root);
  if (!trigger || !content || !root.hasAttribute("open")) return;

  const reference = trigger.getBoundingClientRect();
  const floating = content.getBoundingClientRect();
  const width = document.documentElement.clientWidth || window.innerWidth;
  const height = document.documentElement.clientHeight || window.innerHeight;
  const preferredPlacement = hoverCardPlacement(root);
  const [, align] = splitPlacement(preferredPlacement);
  let [side] = splitPlacement(preferredPlacement);
  let point = coordinates(
    side,
    align,
    reference,
    floating,
    hoverCardOffset(root),
  );

  if (mainAxisOverflow(side, point, floating, width, height)) {
    side = opposite(side);
    point = coordinates(
      side,
      align,
      reference,
      floating,
      hoverCardOffset(root),
    );
  }

  point.x = Math.min(Math.max(0, point.x), Math.max(0, width - floating.width));
  point.y = Math.min(
    Math.max(0, point.y),
    Math.max(0, height - floating.height),
  );
  content.style.position = "fixed";
  content.style.inset = "auto";
  content.style.right = "auto";
  content.style.bottom = "auto";
  content.style.margin = "0";
  content.style.left = `${Math.round(point.x)}px`;
  content.style.top = `${Math.round(point.y)}px`;
  content.dataset.side = side;
  content.dataset.align = align;
  positionArrow(content, floating, side);
}

export function startHoverCardAutoUpdate(root: HTMLElement) {
  stopHoverCardAutoUpdate(root);
  const update = () => positionHoverCard(root);
  const observer =
    typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
  const trigger = hoverCardTrigger(root);
  const content = hoverCardContent(root);
  if (trigger) observer?.observe(trigger);
  if (content) observer?.observe(content);
  window.addEventListener("resize", update);
  document.addEventListener("scroll", update, true);
  autoStates.set(root, {
    cleanup: () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
      document.removeEventListener("scroll", update, true);
    },
  });
  update();
}

export function stopHoverCardAutoUpdate(root: HTMLElement) {
  autoStates.get(root)?.cleanup?.();
  autoStates.delete(root);
}
