import { autoUpdate, computePosition } from "@ariaui-web/position";
import { popoverContent, popoverContentHost, popoverOffset, popoverPlacement, popoverTrigger } from "./popover-dom";

const cleanups = new WeakMap<HTMLElement, () => void>();

export function updatePopoverPosition(root: HTMLElement) {
  const trigger = popoverTrigger(root);
  const content = popoverContent(root);
  if (!trigger || !content || !root.hasAttribute("open")) return;
  const host = popoverContentHost(content);
  const result = computePosition(trigger, host, {
    boundary: "viewport",
    offset: popoverOffset(root),
    placement: popoverPlacement(root),
    strategy: "fixed",
  });
  if (host.style.position !== "fixed") host.style.position = "fixed";
  const left = `${result.x}px`;
  const top = `${result.y}px`;
  const side = result.placement.split("-")[0] ?? "bottom";
  const align = result.placement.split("-")[1] ?? "center";
  if (host.style.left !== left) host.style.left = left;
  if (host.style.top !== top) host.style.top = top;
  if (host.dataset.side !== side) host.dataset.side = side;
  if (host.dataset.align !== align) host.dataset.align = align;
  const arrow = host.querySelector<HTMLElement>("[data-popover-arrow]");
  if (arrow?.dataset.side !== side) arrow?.setAttribute("data-side", side);
}

export function startPopoverPositioning(root: HTMLElement) {
  if (cleanups.has(root)) {
    updatePopoverPosition(root);
    return;
  }
  const trigger = popoverTrigger(root);
  const content = popoverContent(root);
  if (!trigger || !content) return;
  const host = popoverContentHost(content);
  const update = () => updatePopoverPosition(root);
  update();
  cleanups.set(root, autoUpdate(trigger, host, update, () => {}, { ancestorScroll: true }) ?? (() => {}));
}

export function stopPopoverPositioning(root: HTMLElement) {
  cleanups.get(root)?.();
  cleanups.delete(root);
}
