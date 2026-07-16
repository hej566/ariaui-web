import { computePosition } from "@ariaui-web/position";
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
  if (host.style.margin !== "0px") host.style.margin = "0";
  if (host.style.right !== "auto") host.style.right = "auto";
  if (host.style.bottom !== "auto") host.style.bottom = "auto";
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
  const update = () => updatePopoverPosition(root);
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
  win.addEventListener("scroll", schedule, { passive: true });
  cleanups.set(root, () => {
    if (frame) win.cancelAnimationFrame(frame);
    win.removeEventListener("resize", schedule);
    win.removeEventListener("scroll", schedule);
  });
}

export function stopPopoverPositioning(root: HTMLElement) {
  cleanups.get(root)?.();
  cleanups.delete(root);
}
