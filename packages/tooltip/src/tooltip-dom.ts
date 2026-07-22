export type TooltipPlacement =
  | "top" | "top-start" | "top-end"
  | "right" | "right-start" | "right-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "left-start" | "left-end";

const placements = new Set<TooltipPlacement>([
  "top", "top-start", "top-end",
  "right", "right-start", "right-end",
  "bottom", "bottom-start", "bottom-end",
  "left", "left-start", "left-end",
]);

const contentRoots = new WeakMap<HTMLElement, HTMLElement>();
const rootContents = new WeakMap<HTMLElement, HTMLElement>();
let tooltipId = 0;

export const triggerForwardedAttributes = [
  "aria-label", "aria-labelledby", "aria-describedby", "autofocus", "disabled",
  "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget",
  "name", "title", "type",
] as const;

export function tooltipPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function registerTooltipContent(root: HTMLElement, content: HTMLElement) {
  contentRoots.set(content, root);
  rootContents.set(root, content);
}

export function tooltipRoot(element: Element) {
  if (element.matches("aria-tooltip")) return element as HTMLElement;
  if (element instanceof HTMLElement) {
    const registered = contentRoots.get(element);
    if (registered) return registered;
  }
  return element.closest<HTMLElement>("aria-tooltip");
}

export function tooltipTrigger(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-tooltip-trigger"))
    .find((element) => element.closest("aria-tooltip") === root) ?? null;
}

export function tooltipContent(root: HTMLElement) {
  const registered = rootContents.get(root);
  if (registered?.isConnected) return registered;
  const content = Array.from(root.querySelectorAll<HTMLElement>("aria-tooltip-content"))
    .find((element) => element.closest("aria-tooltip") === root) ?? null;
  if (content) registerTooltipContent(root, content);
  return content;
}

export function tooltipTriggerControl(trigger: HTMLElement) {
  if (trigger.hasAttribute("native-composition") && trigger.firstElementChild instanceof HTMLElement) {
    return trigger.firstElementChild;
  }
  return trigger.querySelector<HTMLElement>(":scope > [data-tooltip-trigger-control]");
}

export function tooltipContentControl(content: HTMLElement) {
  if (content.hasAttribute("native-composition")) {
    return Array.from(content.children).find(
      (child): child is HTMLElement => child instanceof HTMLElement && !child.hasAttribute("data-tooltip-arrow"),
    ) ?? content;
  }
  return content;
}

export function ensureTooltipId(content: HTMLElement) {
  const control = tooltipContentControl(content);
  if (!control.id) control.id = `ariaui-tooltip-${++tooltipId}`;
  return control.id;
}

export function tooltipPlacement(root: Element): TooltipPlacement {
  const value = root.getAttribute("placement") as TooltipPlacement | null;
  return value && placements.has(value) ? value : "top";
}

export function tooltipOffset(root: Element) {
  const value = Number(root.getAttribute("offset") ?? "5");
  return Number.isFinite(value) ? value : 5;
}

export function booleanOption(element: Element, name: string, fallback: boolean) {
  const value = element.getAttribute(name);
  return value == null ? fallback : value !== "false";
}
