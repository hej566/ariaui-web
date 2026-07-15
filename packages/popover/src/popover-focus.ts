import {
  booleanAttribute,
  popoverContent,
  popoverContentHost,
  popoverTabbables,
} from "./popover-dom";

type FocusSession = {
  cleanup: () => void;
  inertTargets: readonly HTMLElement[];
  modal: boolean;
};

const focusSessions = new WeakMap<HTMLElement, FocusSession>();

function elementInert(element: HTMLElement) {
  return element as HTMLElement & { inert: boolean };
}

function modalInertTargets(root: HTMLElement) {
  const targets = new Set<HTMLElement>();
  let current: HTMLElement | null = root;
  while (current?.parentElement) {
    for (const sibling of Array.from(current.parentElement.children)) {
      if (sibling !== current && sibling instanceof HTMLElement) targets.add(sibling);
    }
    if (current.parentElement === root.ownerDocument.body) break;
    current = current.parentElement;
  }
  return Array.from(targets);
}

export function startPopoverFocus(root: HTMLElement) {
  const modal = root.hasAttribute("modal");
  const inertTargets = modal ? modalInertTargets(root) : [];
  const existing = focusSessions.get(root);
  if (
    existing?.modal === modal &&
    existing.inertTargets.length === inertTargets.length &&
    existing.inertTargets.every((element, index) => element === inertTargets[index])
  ) {
    return;
  }
  existing?.cleanup();
  focusSessions.delete(root);
  const content = popoverContent(root);
  if (!content) return;
  const host = popoverContentHost(content);
  const doc = root.ownerDocument;
  let active = true;
  let frame = 0;
  let observer: MutationObserver | null = null;
  const inertState = new Map<HTMLElement, { attribute: boolean; value: boolean }>();
  const hadTabIndex = host.hasAttribute("tabindex");
  const previousTabIndex = host.getAttribute("tabindex");

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Tab" || !booleanAttribute(content, "loop", true)) return;
    const tabbables = popoverTabbables(host);
    const first = tabbables[0];
    const last = tabbables.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  };
  host.addEventListener("keydown", onKeyDown);

  const onFocusIn = (event: FocusEvent) => {
    const target = event.target;
    if (target instanceof Node && (target === host || host.contains(target))) return;
    const destination = popoverTabbables(host)[0] ?? host;
    if (destination === host && !host.hasAttribute("tabindex")) host.tabIndex = -1;
    destination.focus({ preventScroll: true });
  };

  if (modal) {
    for (const element of inertTargets) {
      inertState.set(element, { attribute: element.hasAttribute("inert"), value: elementInert(element).inert });
      elementInert(element).inert = true;
      element.setAttribute("inert", "");
    }
    doc.addEventListener("focusin", onFocusIn);
  }

  const requestFrame = globalThis.requestAnimationFrame ?? ((callback: FrameRequestCallback) => {
    queueMicrotask(() => callback(0));
    return 0;
  });
  const cancelFrame = globalThis.cancelAnimationFrame ?? (() => {});
  frame = requestFrame(() => {
    frame = 0;
    if (!active) return;
    const first = popoverTabbables(host)[0];
    if (first) {
      first.focus({ preventScroll: true });
      return;
    }
    observer = new MutationObserver(() => {
      const late = popoverTabbables(host)[0];
      if (!late) return;
      late.focus({ preventScroll: true });
      observer?.disconnect();
      observer = null;
    });
    observer.observe(host, { childList: true, subtree: true });
  });

  const cleanup = () => {
    active = false;
    if (frame) cancelFrame(frame);
    observer?.disconnect();
    host.removeEventListener("keydown", onKeyDown);
    doc.removeEventListener("focusin", onFocusIn);
    for (const [element, previous] of inertState) {
      elementInert(element).inert = previous.value;
      element.toggleAttribute("inert", previous.attribute);
    }
    if (!hadTabIndex) host.removeAttribute("tabindex");
    else if (previousTabIndex != null) host.setAttribute("tabindex", previousTabIndex);
  };
  focusSessions.set(root, { cleanup, inertTargets, modal });
}

export function stopPopoverFocus(root: HTMLElement) {
  focusSessions.get(root)?.cleanup();
  focusSessions.delete(root);
}
