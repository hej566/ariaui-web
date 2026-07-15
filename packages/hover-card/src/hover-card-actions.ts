import { hoverCardPartName, hoverCardRoot } from "./hover-card-dom";
import { requestHoverCardOpen } from "./hover-card-sync";

type ActionState = {
  pointerOverTrigger: boolean;
  pointerOverContent: boolean;
  focusWithin: boolean;
  closeVersion: number;
};

const states = new WeakMap<HTMLElement, ActionState>();

function state(root: HTMLElement) {
  let value = states.get(root);
  if (!value) {
    value = {
      pointerOverTrigger: false,
      pointerOverContent: false,
      focusWithin: false,
      closeVersion: 0,
    };
    states.set(root, value);
  }
  return value;
}

function guardedClose(root: HTMLElement, source: Element) {
  const value = state(root);
  const version = ++value.closeVersion;
  queueMicrotask(() => {
    if (
      version !== value.closeVersion ||
      value.pointerOverTrigger ||
      value.pointerOverContent ||
      value.focusWithin
    ) {
      return;
    }
    requestHoverCardOpen(root, false, source);
  });
}

export function handleHoverCardMouseEnter(element: HTMLElement) {
  const root = hoverCardRoot(element);
  if (!root) return;
  const value = state(root);
  if (hoverCardPartName(element) === "Trigger") value.pointerOverTrigger = true;
  if (hoverCardPartName(element) === "Content") value.pointerOverContent = true;
  value.closeVersion += 1;
  requestHoverCardOpen(root, true, element);
}

export function handleHoverCardMouseLeave(element: HTMLElement) {
  const root = hoverCardRoot(element);
  if (!root) return;
  const value = state(root);
  if (hoverCardPartName(element) === "Trigger")
    value.pointerOverTrigger = false;
  if (hoverCardPartName(element) === "Content")
    value.pointerOverContent = false;
  guardedClose(root, element);
}

export function handleHoverCardFocus(element: HTMLElement) {
  if (hoverCardPartName(element) !== "Trigger") return;
  const root = hoverCardRoot(element);
  if (!root) return;
  const value = state(root);
  value.focusWithin = true;
  value.closeVersion += 1;
  requestHoverCardOpen(root, true, element);
}

export function handleHoverCardBlur(element: HTMLElement) {
  if (hoverCardPartName(element) !== "Trigger") return;
  const root = hoverCardRoot(element);
  if (!root) return;
  state(root).focusWithin = false;
  guardedClose(root, element);
}

export function handleHoverCardKeyDown(
  element: HTMLElement,
  event: KeyboardEvent,
) {
  if (event.key !== "Escape") return;
  const root = hoverCardRoot(element);
  if (!root || !root.hasAttribute("open")) return;
  event.preventDefault();
  requestHoverCardOpen(root, false, element);
}
