import {
  ensureHoverCardId,
  hoverCardContent,
  hoverCardRoot,
  hoverCardTrigger,
} from "./hover-card-dom";
import {
  startHoverCardAutoUpdate,
  stopHoverCardAutoUpdate,
} from "./hover-card-position";

type SyncState = {
  defaultOpenApplied: boolean;
  observer: MutationObserver | null;
  syncing: boolean;
};

const states = new WeakMap<HTMLElement, SyncState>();

function state(root: HTMLElement) {
  let value = states.get(root);
  if (!value) {
    value = { defaultOpenApplied: false, observer: null, syncing: false };
    states.set(root, value);
  }
  return value;
}

function setState(element: HTMLElement, open: boolean) {
  element.setAttribute("data-state", open ? "open" : "closed");
}

function ensureHoverCardArrow(content: HTMLElement) {
  let arrow = content.querySelector<HTMLElement>("[data-hover-card-arrow]");
  if (!content.hasAttribute("arrow")) {
    arrow?.remove();
    return;
  }
  if (!arrow) {
    arrow = document.createElement("span");
    arrow.setAttribute("data-hover-card-arrow", "");
    arrow.setAttribute("aria-hidden", "true");
    content.prepend(arrow);
  }
  arrow.className = content.getAttribute("arrow-class") ?? "";
}

export function syncHoverCardPart(element: HTMLElement) {
  const root = hoverCardRoot(element);
  if (root) syncHoverCardRoot(root);
}

export function observeHoverCardRoot(root: HTMLElement) {
  const value = state(root);
  if (value.observer || typeof MutationObserver === "undefined") return;
  value.observer = new MutationObserver(() => syncHoverCardRoot(root));
  value.observer.observe(root, { childList: true, subtree: true });
}

export function disconnectHoverCardRoot(root: HTMLElement) {
  stopHoverCardAutoUpdate(root);
  state(root).observer?.disconnect();
  state(root).observer = null;
}

export function syncHoverCardRoot(root: HTMLElement) {
  const value = state(root);
  if (value.syncing) return;
  value.syncing = true;
  try {
    if (!value.defaultOpenApplied) {
      value.defaultOpenApplied = true;
      if (root.hasAttribute("default-open") && !root.hasAttribute("open")) {
        root.setAttribute("open", "");
      }
    }

    const open = root.hasAttribute("open");
    const trigger = hoverCardTrigger(root);
    const content = hoverCardContent(root);
    setState(root, open);

    if (trigger) {
      const triggerId = ensureHoverCardId(trigger, "trigger");
      setState(trigger, open);
      if (content) {
        const contentId = ensureHoverCardId(content, "content");
        trigger.setAttribute("aria-controls", contentId);
        content.setAttribute("aria-labelledby", triggerId);
      }
      trigger.setAttribute("aria-expanded", String(open));
    }

    if (content) {
      content.setAttribute("role", content.getAttribute("role") ?? "tooltip");
      setState(content, open);
      ensureHoverCardArrow(content);

      const popoverContent = content as HTMLElement & {
        showPopover?: () => void;
        hidePopover?: () => void;
      };
      content.setAttribute("popover", "manual");
      if (open) {
        content.hidden = false;
        try {
          popoverContent.showPopover?.();
        } catch {
          // The content can already be in the top layer while state is resynchronized.
        }
        startHoverCardAutoUpdate(root);
      } else {
        stopHoverCardAutoUpdate(root);
        try {
          popoverContent.hidePopover?.();
        } catch {
          // The content can already be outside the top layer while state is resynchronized.
        }
        content.hidden = true;
      }
    }
  } finally {
    value.syncing = false;
  }
}

export function requestHoverCardOpen(
  root: HTMLElement,
  open: boolean,
  source: Element,
) {
  if (root.hasAttribute("open") === open) return false;
  const event = new CustomEvent("openchange", {
    bubbles: true,
    cancelable: true,
    detail: { open, source },
  });
  if (!root.dispatchEvent(event)) return false;
  root.toggleAttribute("open", open);
  syncHoverCardRoot(root);
  return true;
}

export function hoverCardObservedAttributes() {
  return [
    "arrow",
    "arrow-class",
    "default-open",
    "offset",
    "open",
    "placement",
  ] as const;
}
