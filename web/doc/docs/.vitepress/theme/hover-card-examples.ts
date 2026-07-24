import { animate } from "framer-motion/dom";

type HoverCardRoot = HTMLElement & { open: boolean };
type OpenChangeEvent = CustomEvent<{ open: boolean; source: Element }>;
type MotionState = {
  version: number;
  stop: (() => void) | null;
  exiting: boolean;
};

const installedDocuments = new WeakSet<Document>();
const motionStates = new WeakMap<HoverCardRoot, MotionState>();

function motionState(root: HoverCardRoot) {
  let state = motionStates.get(root);
  if (!state) {
    state = { version: 0, stop: null, exiting: false };
    motionStates.set(root, state);
  }
  return state;
}

function reducedMotion(root: Element) {
  return (
    root.ownerDocument.defaultView?.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches ?? false
  );
}

function hoverCardExampleContent(root: HTMLElement) {
  const portalledId = root.querySelector<HTMLElement>(
    ':scope > aria-portal[data-hover-card-portal="content"]',
  )?.getAttribute("data-hover-card-portal-content");
  return (
    root.querySelector<HTMLElement>("aria-hover-card-content") ??
    (portalledId
      ? root.ownerDocument.getElementById(portalledId)
      : null)
  );
}

function bindMotionRoot(root: HoverCardRoot) {
  if (root.dataset.hoverCardMotionBound === "true") return;
  const content = hoverCardExampleContent(root);
  const trigger = root.querySelector<HTMLElement>("aria-hover-card-trigger");
  if (!content || !trigger) return;
  root.dataset.hoverCardMotionBound = "true";

  const interruptExit = () => {
    const state = motionState(root);
    if (!state.exiting) return;
    const version = ++state.version;
    state.stop?.();
    state.stop = null;
    state.exiting = false;
    content.style.pointerEvents = "";
    if (reducedMotion(root)) return;
    const controls = animate(
      content,
      { opacity: 1, y: 0, scale: 1 },
      { duration: 0.18, ease: "easeOut" },
    );
    state.stop = () => controls.stop();
    void controls.then(() => {
      const current = motionState(root);
      if (current.version === version) current.stop = null;
    });
  };
  trigger.addEventListener("mouseenter", interruptExit);
  trigger.addEventListener("focus", interruptExit);
  content.addEventListener("mouseenter", interruptExit);
  content.addEventListener("focusin", interruptExit);

  root.addEventListener("openchange", (event) => {
    const change = event as OpenChangeEvent;
    event.preventDefault();

    const state = motionState(root);
    const version = ++state.version;
    state.stop?.();
    state.stop = null;

    if (change.detail.open) {
      state.exiting = false;
      root.open = true;
      content.style.pointerEvents = "";
      if (reducedMotion(root)) return;
      const controls = animate(
        content,
        { opacity: [0, 1], y: [8, 0], scale: [0.96, 1] },
        { duration: 0.18, ease: "easeOut" },
      );
      state.stop = () => controls.stop();
      return;
    }

    content.style.pointerEvents = "none";
    state.exiting = true;
    if (reducedMotion(root)) {
      state.exiting = false;
      root.open = false;
      content.style.pointerEvents = "";
      return;
    }

    const controls = animate(
      content,
      { opacity: [1, 0], y: [0, 8], scale: [1, 0.96] },
      { duration: 0.18, ease: "easeOut" },
    );
    state.stop = () => controls.stop();
    void controls.then(() => {
      if (motionState(root).version !== version) return;
      root.open = false;
      content.style.pointerEvents = "";
      const current = motionState(root);
      current.stop = null;
      current.exiting = false;
    });
  });
}

function bindExamples(doc: Document) {
  for (const root of doc.querySelectorAll<HoverCardRoot>(
    '[data-component="hover-card"][data-example-variant="framer-motion"] aria-hover-card[data-hover-card-motion]',
  )) {
    bindMotionRoot(root);
  }
}

export function installHoverCardExamples(doc: Document = document) {
  bindExamples(doc);
  if (installedDocuments.has(doc)) return;
  installedDocuments.add(doc);
  const observer = new MutationObserver(() => bindExamples(doc));
  observer.observe(doc.documentElement, { childList: true, subtree: true });
}
