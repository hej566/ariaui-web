import { createPortalElement } from "@ariaui-web/portal";
import {
  ensureTooltipId,
  registerTooltipContent,
  tooltipContent,
  tooltipContentControl,
  tooltipRoot,
  tooltipTrigger,
  tooltipTriggerControl,
  triggerForwardedAttributes,
} from "./tooltip-dom";
import { startTooltipPositioning, stopTooltipPositioning } from "./tooltip-position";

type RootState = {
  defaultOpenApplied: boolean;
  observer: MutationObserver | null;
  onOpenChange: ((open: boolean) => void) | null;
  syncing: boolean;
};

type TriggerState = { authoredClass: string; boundControl: HTMLElement | null };

const rootStates = new WeakMap<HTMLElement, RootState>();
const triggerStates = new WeakMap<HTMLElement, TriggerState>();
const contentPortals = new WeakMap<HTMLElement, HTMLElement>();

function rootState(root: HTMLElement) {
  let state = rootStates.get(root);
  if (!state) {
    state = { defaultOpenApplied: false, observer: null, onOpenChange: null, syncing: false };
    rootStates.set(root, state);
  }
  return state;
}

function triggerState(trigger: HTMLElement) {
  let state = triggerStates.get(trigger);
  if (!state) {
    const existing = tooltipTriggerControl(trigger);
    state = { authoredClass: existing?.className ?? "", boundControl: null };
    triggerStates.set(trigger, state);
  }
  return state;
}

export function ensureTooltipTriggerControl(trigger: HTMLElement) {
  let control = tooltipTriggerControl(trigger);
  if (!control) {
    const button = trigger.ownerDocument.createElement("button");
    button.type = "button";
    button.setAttribute("data-tooltip-trigger-control", "");
    for (const node of Array.from(trigger.childNodes)) button.append(node);
    trigger.append(button);
    control = button;
  }
  return control;
}

function syncTrigger(trigger: HTMLElement, root: HTMLElement, open: boolean, content: HTMLElement | null) {
  const control = ensureTooltipTriggerControl(trigger);
  const state = triggerState(trigger);
  for (const attribute of triggerForwardedAttributes) {
    const value = trigger.getAttribute(attribute);
    if (value == null) control.removeAttribute(attribute);
    else control.setAttribute(attribute, value);
  }
  if (control instanceof HTMLButtonElement) {
    const type = trigger.getAttribute("type");
    control.type = type === "submit" || type === "reset" ? type : "button";
    control.disabled = trigger.hasAttribute("disabled");
  }
  control.className = Array.from(new Set(`${state.authoredClass} ${trigger.className}`.trim().split(/\s+/).filter(Boolean))).join(" ");
  control.dataset.state = open ? "open" : "closed";
  const authoredDescription = trigger.getAttribute("aria-describedby")?.trim() ?? "";
  const description = open && content
    ? `${authoredDescription} ${ensureTooltipId(content)}`.trim()
    : authoredDescription;
  if (description) control.setAttribute("aria-describedby", description);
  else control.removeAttribute("aria-describedby");
  trigger.dataset.state = open ? "open" : "closed";
  for (const attribute of ["role", "tabindex", "aria-disabled"]) trigger.removeAttribute(attribute);
}

function ensureTooltipArrow(content: HTMLElement) {
  const control = tooltipContentControl(content);
  let arrow = control.querySelector<HTMLElement>(":scope > [data-tooltip-arrow]");
  if (!content.hasAttribute("arrow")) {
    arrow?.remove();
    return;
  }
  if (!arrow) {
    arrow = content.ownerDocument.createElement("span");
    arrow.setAttribute("data-tooltip-arrow", "");
    arrow.setAttribute("aria-hidden", "true");
    arrow.innerHTML = '<svg viewBox="0 0 10 5" aria-hidden="true"><path d="M0 5 5 0l5 5Z"></path></svg>';
    control.prepend(arrow);
  }
  arrow.className = content.getAttribute("arrow-class") ?? "";
}

function syncContent(content: HTMLElement, open: boolean) {
  const control = tooltipContentControl(content);
  ensureTooltipId(content);
  ensureTooltipArrow(content);
  if (control !== content) {
    content.removeAttribute("role");
    control.className = Array.from(new Set(`${control.className} ${content.className}`.trim().split(/\s+/).filter(Boolean))).join(" ");
  }
  control.setAttribute("role", "tooltip");
  control.removeAttribute("tabindex");
  control.dataset.state = open ? "open" : "closed";
  content.dataset.state = open ? "open" : "closed";
  control.hidden = !open;
  content.hidden = !open;
  if (open) {
    control.style.position = "fixed";
    if (control.dataset.positioned !== "true") control.style.visibility = "hidden";
  } else {
    delete control.dataset.positioned;
  }
}

export function portalTooltipContent(content: HTMLElement) {
  if (contentPortals.has(content)) return;
  const root = tooltipRoot(content);
  if (!root) {
    content.dataset.state = "closed";
    content.hidden = true;
    return;
  }
  registerTooltipContent(root, content);
  const portal = createPortalElement();
  portal.setAttribute("data-tooltip-portal", "");
  portal.setAttribute("data-tooltip-content", ensureTooltipId(content));
  contentPortals.set(content, portal);
  content.before(portal);
  portal.append(content);
}

export function syncTooltipPart(element: HTMLElement) {
  const root = tooltipRoot(element);
  if (root) syncTooltipRoot(root);
  else if (element.matches("aria-tooltip-content")) {
    element.dataset.state = "closed";
    element.hidden = true;
  }
}

export function syncTooltipRoot(root: HTMLElement) {
  const state = rootState(root);
  if (state.syncing) return;
  state.syncing = true;
  try {
    if (!state.defaultOpenApplied) {
      state.defaultOpenApplied = true;
      if (root.hasAttribute("default-open") && !root.hasAttribute("open")) root.setAttribute("open", "");
    }
    const open = root.hasAttribute("open");
    const trigger = tooltipTrigger(root);
    const content = tooltipContent(root);
    root.dataset.state = open ? "open" : "closed";
    if (content) syncContent(content, open);
    if (trigger) syncTrigger(trigger, root, open, content);
    if (open && trigger && content) startTooltipPositioning(root);
    else stopTooltipPositioning(root);
  } finally {
    state.syncing = false;
  }
}

export function observeTooltipRoot(root: HTMLElement) {
  const state = rootState(root);
  if (state.observer || typeof MutationObserver === "undefined") return;
  state.observer = new MutationObserver(() => syncTooltipRoot(root));
  state.observer.observe(root, { childList: true, subtree: true });
}

export function disconnectTooltipRoot(root: HTMLElement) {
  stopTooltipPositioning(root);
  const state = rootState(root);
  state.observer?.disconnect();
  state.observer = null;
}

export function requestTooltipOpen(root: HTMLElement, open: boolean, source: Element) {
  if (root.hasAttribute("open") === open) return false;
  const event = new CustomEvent("openchange", { bubbles: true, cancelable: true, detail: { open, source } });
  if (!root.dispatchEvent(event)) return false;
  rootState(root).onOpenChange?.(open);
  root.toggleAttribute("open", open);
  syncTooltipRoot(root);
  return true;
}

export function getTooltipOpenChange(root: HTMLElement) { return rootState(root).onOpenChange; }
export function setTooltipOpenChange(root: HTMLElement, callback: ((open: boolean) => void) | null) { rootState(root).onOpenChange = callback; }
