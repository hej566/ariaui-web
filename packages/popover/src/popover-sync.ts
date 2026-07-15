import { installPopoverDismissal, removePopoverDismissal } from "./popover-actions";
import {
  ensurePopoverId,
  popoverContent,
  popoverContentHost,
  popoverDescriptionHosts,
  popoverHeadingHosts,
  popoverRoot,
  popoverTrigger,
  type PopoverRootElement,
} from "./popover-dom";
import { startPopoverFocus, stopPopoverFocus } from "./popover-focus";
import { startPopoverPositioning, stopPopoverPositioning } from "./popover-position";

type PopoverSyncState = {
  defaultOpenApplied: boolean;
  syncing: boolean;
};

const states = new WeakMap<HTMLElement, PopoverSyncState>();

function stateFor(root: HTMLElement) {
  const existing = states.get(root);
  if (existing) return existing;
  const state = { defaultOpenApplied: false, syncing: false };
  states.set(root, state);
  return state;
}

function setInert(element: HTMLElement, inert: boolean) {
  element.toggleAttribute("inert", inert);
  if ("inert" in element) (element as HTMLElement & { inert: boolean }).inert = inert;
}

function setAttributeIfChanged(element: HTMLElement, name: string, value: string) {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value);
}

function removeAttributeIfPresent(element: HTMLElement, name: string) {
  if (element.hasAttribute(name)) element.removeAttribute(name);
}

function directPopoverArrow(host: HTMLElement) {
  return Array.from(host.children).find(
    (child): child is HTMLElement => child instanceof HTMLElement && child.hasAttribute("data-popover-arrow"),
  ) ?? null;
}

function syncPopoverArrow(content: HTMLElement, host: HTMLElement) {
  const existing = directPopoverArrow(host);
  if (!content.hasAttribute("arrow")) {
    existing?.remove();
    return;
  }
  const arrow = existing ?? document.createElement("span");
  arrow.setAttribute("data-popover-arrow", "");
  arrow.setAttribute("aria-hidden", "true");
  arrow.className = content.getAttribute("arrow-class") ?? "";
  if (!existing) arrow.innerHTML = '<svg viewBox="0 0 10 5"><path d="M0 5 5 0l5 5Z"></path></svg>';
  if (!existing) host.prepend(arrow);
}

function showPopoverHost(host: HTMLElement) {
  host.hidden = false;
  if (host.getAttribute("popover") !== "manual") host.setAttribute("popover", "manual");
  const show = (host as HTMLElement & { showPopover?: () => void }).showPopover;
  if (typeof show === "function") {
    try {
      show.call(host);
    } catch {
      // The browser may throw when the top-layer state is already open.
    }
  }
}

function hidePopoverHost(content: HTMLElement, host: HTMLElement, force = false) {
  if (content.hasAttribute("force-mount") && !force) {
    host.hidden = false;
    return;
  }
  const hide = (host as HTMLElement & { hidePopover?: () => void }).hidePopover;
  if (typeof hide === "function") {
    try {
      hide.call(host);
    } catch {
      // The browser may throw when the top-layer state is already closed.
    }
  }
  host.hidden = !content.hasAttribute("force-mount");
}

export function syncPopoverTreeAround(element: HTMLElement) {
  const root = popoverRoot(element);
  if (root instanceof HTMLElement) syncPopoverTreeFromRoot(root as PopoverRootElement);
}

export function syncPopoverTreeFromRoot(root: PopoverRootElement) {
  const syncState = stateFor(root);
  if (syncState.syncing) return;
  syncState.syncing = true;

  try {
    if (!syncState.defaultOpenApplied) {
      syncState.defaultOpenApplied = true;
      if (root.hasAttribute("default-open") && !root.hasAttribute("open")) root.setAttribute("open", "");
    }

    const open = root.hasAttribute("open");
    const state = open ? "open" : "closed";
    root.setAttribute("data-state", state);

    const trigger = popoverTrigger(root);
    const content = popoverContent(root);
    if (!content) {
      removePopoverDismissal(root);
      stopPopoverFocus(root);
      stopPopoverPositioning(root);
      if (trigger) {
        removeAttributeIfPresent(trigger, "aria-controls");
        setAttributeIfChanged(trigger, "aria-haspopup", "dialog");
        setAttributeIfChanged(trigger, "aria-expanded", String(open));
        setAttributeIfChanged(trigger, "data-state", state);
      }
      return;
    }

    const host = popoverContentHost(content);
    syncPopoverArrow(content, host);
    ensurePopoverId(host, "content");
    if (trigger) {
      if (open) setAttributeIfChanged(trigger, "aria-controls", host.id);
      else removeAttributeIfPresent(trigger, "aria-controls");
      setAttributeIfChanged(trigger, "aria-haspopup", "dialog");
      setAttributeIfChanged(trigger, "aria-expanded", String(open));
      setAttributeIfChanged(trigger, "data-state", state);
    }

    const headingParts = Array.from(content.querySelectorAll<HTMLElement>("aria-popover-heading"))
      .filter((heading) => heading.closest("aria-popover-content") === content);
    const headings = popoverHeadingHosts(content);
    headingParts.forEach((part, index) => {
      const heading = headings[index] ?? part;
      ensurePopoverId(heading, "heading");
      if (heading !== part) {
        part.removeAttribute("role");
        part.removeAttribute("aria-level");
      } else {
        if (!heading.hasAttribute("role")) heading.setAttribute("role", "heading");
        if (!heading.hasAttribute("aria-level")) heading.setAttribute("aria-level", "2");
      }
    });

    const descriptions = popoverDescriptionHosts(content);
    descriptions.forEach((description) => ensurePopoverId(description, "description"));

    if (host !== content) {
      content.removeAttribute("role");
      content.removeAttribute("aria-modal");
      content.removeAttribute("aria-labelledby");
      content.removeAttribute("aria-describedby");
    }
    host.setAttribute("role", "dialog");
    host.setAttribute("aria-modal", String(root.hasAttribute("modal")));
    setInert(host, !open);
    if (open) host.removeAttribute("aria-hidden");
    else host.setAttribute("aria-hidden", "true");

    if (headings.length) host.setAttribute("aria-labelledby", headings.map((item) => item.id).join(" "));
    else host.removeAttribute("aria-labelledby");
    if (descriptions.length) host.setAttribute("aria-describedby", descriptions.map((item) => item.id).join(" "));
    else host.removeAttribute("aria-describedby");

    content.setAttribute("data-state", state);
    host.setAttribute("data-state", state);

    if (open) installPopoverDismissal(root);
    else removePopoverDismissal(root);

    if (open) {
      showPopoverHost(host);
      startPopoverPositioning(root);
      startPopoverFocus(root);
    } else {
      stopPopoverFocus(root);
      stopPopoverPositioning(root);
      hidePopoverHost(content, host);
    }
  } finally {
    syncState.syncing = false;
  }
}

export function cleanupPopoverRoot(root: HTMLElement) {
  removePopoverDismissal(root);
  stopPopoverFocus(root);
  stopPopoverPositioning(root);
  const content = popoverContent(root);
  if (content) hidePopoverHost(content, popoverContentHost(content), true);
  states.delete(root);
}
