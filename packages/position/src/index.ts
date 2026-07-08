export type Placement = "top" | "right" | "bottom" | "left";

export interface Options {
  placement?: Placement;
  offset?: number;
}

export interface Return {
  x: number;
  y: number;
  placement: Placement;
}

export function computePosition(reference: Element, floating: HTMLElement, options: Options = {}): Return {
  const placement = options.placement ?? "bottom";
  const offset = options.offset ?? 0;
  const referenceRect = reference.getBoundingClientRect();
  const floatingRect = floating.getBoundingClientRect();

  if (placement === "top") {
    return { x: referenceRect.left, y: referenceRect.top - floatingRect.height - offset, placement };
  }

  if (placement === "right") {
    return { x: referenceRect.right + offset, y: referenceRect.top, placement };
  }

  if (placement === "left") {
    return { x: referenceRect.left - floatingRect.width - offset, y: referenceRect.top, placement };
  }

  return { x: referenceRect.left, y: referenceRect.bottom + offset, placement };
}

export function detectOverflow(element: Element) {
  const rect = element.getBoundingClientRect();
  return {
    top: Math.max(0, -rect.top),
    right: Math.max(0, rect.right - window.innerWidth),
    bottom: Math.max(0, rect.bottom - window.innerHeight),
    left: Math.max(0, -rect.left),
  };
}

export function autoUpdate(_reference: Element, _floating: HTMLElement, update: () => void) {
  update();
  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
}

export { componentSpec } from "./component-spec";
