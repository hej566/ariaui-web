import {
  popoverContent,
  popoverContentHost,
  popoverPartName,
  popoverRoot,
  popoverTrigger,
  type PopoverRootElement,
} from "./popover-dom";

const dismissalCleanups = new WeakMap<HTMLElement, () => void>();

export function requestPopoverOpen(
  root: PopoverRootElement,
  open: boolean,
  source: Element,
  restoreFocus = false,
) {
  if (root.open === open) return true;
  const event = new CustomEvent("openchange", {
    bubbles: true,
    cancelable: true,
    detail: { open, source },
  });
  if (!root.dispatchEvent(event)) return false;
  root.open = open;
  if (!open && restoreFocus) {
    queueMicrotask(() => popoverTrigger(root)?.focus({ preventScroll: true }));
  }
  return true;
}

export function handlePopoverClick(element: HTMLElement, event: Event) {
  const part = popoverPartName(element);
  if (part !== "Trigger" && part !== "Close") return;
  queueMicrotask(() => {
    if (event.defaultPrevented || element.hasAttribute("disabled")) return;
    const root = popoverRoot(element);
    if (!(root instanceof HTMLElement) || typeof (root as PopoverRootElement).syncPopoverTreeFromRoot !== "function") return;
    requestPopoverOpen(
      root as PopoverRootElement,
      part === "Trigger" ? !root.hasAttribute("open") : false,
      element,
      part === "Close",
    );
  });
}

export function installPopoverDismissal(root: PopoverRootElement) {
  if (dismissalCleanups.has(root)) return;
  const doc = root.ownerDocument;
  const onMouseDown = (event: MouseEvent) => {
    if (event.defaultPrevented) return;
    const target = event.target;
    const trigger = popoverTrigger(root);
    const content = popoverContent(root);
    const host = content ? popoverContentHost(content) : null;
    if (target instanceof Node && (trigger?.contains(target) || host?.contains(target))) return;
    requestPopoverOpen(root, false, root);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.key !== "Escape") return;
    event.preventDefault();
    requestPopoverOpen(root, false, popoverContentHost(popoverContent(root) ?? root), true);
  };
  doc.addEventListener("mousedown", onMouseDown);
  doc.addEventListener("keydown", onKeyDown);
  dismissalCleanups.set(root, () => {
    doc.removeEventListener("mousedown", onMouseDown);
    doc.removeEventListener("keydown", onKeyDown);
  });
}

export function removePopoverDismissal(root: HTMLElement) {
  dismissalCleanups.get(root)?.();
  dismissalCleanups.delete(root);
}
