import { switchPartName, switchRoot } from "./switch-dom";
import { syncSwitchRoot } from "./switch-sync";

function isSpace(event: KeyboardEvent) {
  return event.key === " " || event.key === "Spacebar";
}

function effectiveDisabled(track: HTMLElement, root: HTMLElement) {
  return track.hasAttribute("disabled") || root.hasAttribute("disabled");
}

function activateTrack(track: HTMLElement, event: Event) {
  const root = switchRoot(track);
  if (!root || effectiveDisabled(track, root)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (root) syncSwitchRoot(root);
    return;
  }

  const input = root.querySelector<HTMLInputElement>(":scope > input[data-switch-input]");
  input?.click();
}

export function handleSwitchClick(element: HTMLElement, event: Event) {
  if (event.defaultPrevented || switchPartName(element) !== "Track") return;
  const target = event.target;
  if (target instanceof Element && target.closest("aria-switch-track") !== element) return;
  activateTrack(element, event);
}

export function handleSwitchKeyDown(element: HTMLElement, event: KeyboardEvent) {
  if (event.defaultPrevented || switchPartName(element) !== "Track" || !isSpace(event)) return;
  event.preventDefault();
  activateTrack(element, event);
}
