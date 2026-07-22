import { booleanOption, tooltipContent, tooltipContentControl, tooltipRoot, tooltipTrigger, tooltipTriggerControl } from "./tooltip-dom";
import { requestTooltipOpen } from "./tooltip-sync";

type ActionState = {
  closeVersion: number;
  focusWithinTrigger: boolean;
  pointerOverContent: boolean;
  pointerOverTrigger: boolean;
};

const states = new WeakMap<HTMLElement, ActionState>();

function state(root: HTMLElement) {
  let value = states.get(root);
  if (!value) {
    value = { closeVersion: 0, focusWithinTrigger: false, pointerOverContent: false, pointerOverTrigger: false };
    states.set(root, value);
  }
  return value;
}

function disabled(trigger: HTMLElement, control: HTMLElement) {
  return trigger.hasAttribute("disabled") || control.getAttribute("aria-disabled") === "true" || (control instanceof HTMLButtonElement && control.disabled);
}

function guardedClose(root: HTMLElement, source: Element, event?: Event) {
  const value = state(root);
  const version = ++value.closeVersion;
  queueMicrotask(() => {
    if (event?.defaultPrevented || version !== value.closeVersion || value.pointerOverTrigger || value.pointerOverContent || value.focusWithinTrigger) return;
    requestTooltipOpen(root, false, source);
  });
}

export function bindTooltipTrigger(trigger: HTMLElement, control: HTMLElement) {
  const value = stateForBoundControl(trigger);
  if (value === control) return;
  boundControls.set(trigger, control);
  control.addEventListener("mouseenter", () => {
    const root = tooltipRoot(trigger);
    if (!root || disabled(trigger, control) || !booleanOption(trigger, "hover", true)) return;
    const current = state(root);
    current.pointerOverTrigger = true;
    current.closeVersion += 1;
    requestTooltipOpen(root, true, trigger);
  });
  control.addEventListener("mouseleave", (event) => {
    const root = tooltipRoot(trigger);
    if (!root || !booleanOption(trigger, "hover", true)) return;
    const current = state(root);
    current.pointerOverTrigger = false;
    const content = tooltipContent(root);
    const floating = content ? tooltipContentControl(content) : null;
    if (event.relatedTarget instanceof Node && floating?.contains(event.relatedTarget)) return;
    guardedClose(root, trigger, event);
  });
  control.addEventListener("focus", () => {
    const root = tooltipRoot(trigger);
    if (!root || disabled(trigger, control) || !booleanOption(trigger, "focus", true)) return;
    const current = state(root);
    current.focusWithinTrigger = true;
    current.closeVersion += 1;
    requestTooltipOpen(root, true, trigger);
  });
  control.addEventListener("blur", (event) => {
    const root = tooltipRoot(trigger);
    if (!root || !booleanOption(trigger, "focus", true)) return;
    state(root).focusWithinTrigger = false;
    guardedClose(root, trigger, event);
  });
  control.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const root = tooltipRoot(trigger);
    if (!root || !root.hasAttribute("open")) return;
    event.stopPropagation();
    requestTooltipOpen(root, false, trigger);
  });
}

const boundControls = new WeakMap<HTMLElement, HTMLElement>();
function stateForBoundControl(trigger: HTMLElement) { return boundControls.get(trigger) ?? null; }

export function bindTooltipContent(content: HTMLElement, control: HTMLElement) {
  if (boundContentControls.get(content) === control) return;
  boundContentControls.set(content, control);
  control.addEventListener("mouseenter", () => {
    const root = tooltipRoot(content);
    if (!root) return;
    const current = state(root);
    current.pointerOverContent = true;
    current.closeVersion += 1;
  });
  control.addEventListener("mouseleave", (event) => {
    const root = tooltipRoot(content);
    if (!root) return;
    const current = state(root);
    current.pointerOverContent = false;
    const trigger = tooltipTrigger(root);
    const reference = trigger ? tooltipTriggerControl(trigger) : null;
    if (event.relatedTarget instanceof Node && reference?.contains(event.relatedTarget)) return;
    guardedClose(root, content, event);
  });
}

const boundContentControls = new WeakMap<HTMLElement, HTMLElement>();
