import { computePosition } from "@ariaui-web/position";
import {
  tooltipContent,
  tooltipContentControl,
  tooltipOffset,
  tooltipPlacement,
  tooltipTrigger,
  tooltipTriggerControl,
} from "./tooltip-dom";

const cleanups = new WeakMap<HTMLElement, () => void>();
const updating = new WeakSet<HTMLElement>();

export function updateTooltipPosition(root: HTMLElement) {
  if (!root.hasAttribute("open") || updating.has(root)) return;
  const trigger = tooltipTrigger(root);
  const content = tooltipContent(root);
  if (!trigger || !content) return;
  const reference = tooltipTriggerControl(trigger);
  const floating = tooltipContentControl(content);
  if (!reference || !floating) return;
  updating.add(root);
  try {
    const result = computePosition(reference, floating, {
      boundary: "viewport",
      offset: tooltipOffset(root),
      placement: tooltipPlacement(root),
      strategy: "fixed",
    });
    const left = `${result.x}px`;
    const top = `${result.y}px`;
    const side = result.placement.split("-")[0] ?? "top";
    const align = result.placement.split("-")[1] ?? "center";
    if (floating.style.position !== "fixed") floating.style.position = "fixed";
    if (floating.style.left !== left) floating.style.left = left;
    if (floating.style.top !== top) floating.style.top = top;
    if (floating.style.margin !== "0px") floating.style.margin = "0px";
    if (floating.style.visibility !== "visible") floating.style.visibility = "visible";
    if (floating.dataset.side !== side) floating.dataset.side = side;
    if (floating.dataset.align !== align) floating.dataset.align = align;
    floating.dataset.positioned = "true";
    const arrow = floating.querySelector<HTMLElement>("[data-tooltip-arrow]");
    if (arrow && arrow.dataset.side !== side) arrow.setAttribute("data-side", side);
  } finally {
    updating.delete(root);
  }
}

export function startTooltipPositioning(root: HTMLElement) {
  if (cleanups.has(root)) {
    updateTooltipPosition(root);
    return;
  }
  const update = () => updateTooltipPosition(root);
  const win = root.ownerDocument.defaultView ?? window;
  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = win.requestAnimationFrame(() => {
      frame = 0;
      update();
    });
  };
  update();
  win.addEventListener("resize", schedule);
  win.addEventListener("scroll", schedule, { passive: true, capture: true });
  cleanups.set(root, () => {
    if (frame) win.cancelAnimationFrame(frame);
    win.removeEventListener("resize", schedule);
    win.removeEventListener("scroll", schedule, { capture: true });
  });
}

export function stopTooltipPositioning(root: HTMLElement) {
  cleanups.get(root)?.();
  cleanups.delete(root);
}
