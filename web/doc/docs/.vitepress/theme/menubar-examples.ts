import { animate } from "framer-motion/dom";

type MotionState = {
  initialized: boolean;
  open: boolean;
  stop: (() => void) | null;
  version: number;
};

const installedDocuments = new WeakSet<Document>();
const motionStates = new WeakMap<HTMLElement, MotionState>();

function state(panel: HTMLElement) {
  let current = motionStates.get(panel);
  if (!current) {
    current = { initialized: false, open: false, stop: null, version: 0 };
    motionStates.set(panel, current);
  }
  return current;
}

function reducedMotion(panel: Element) {
  return panel.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function panelIsOpen(panel: HTMLElement) {
  const content = panel.closest<HTMLElement>("aria-menubar-content, aria-menubar-sub-content");
  return (panel.getAttribute("data-state") ?? content?.getAttribute("data-state")) === "open" && !panel.hidden;
}

function animatePanel(panel: HTMLElement, open: boolean) {
  const current = state(panel);
  const version = ++current.version;
  const isSubmenu = panel.closest("aria-menubar-sub-content") !== null;
  const reduced = reducedMotion(panel);

  current.stop?.();
  current.open = open;
  panel.hidden = false;
  panel.style.pointerEvents = open ? "" : "none";
  panel.toggleAttribute("aria-hidden", !open);

  const keyframes = reduced
    ? { opacity: open ? [0, 1] : [1, 0] }
    : isSubmenu
      ? { opacity: open ? [0, 1] : [1, 0], x: open ? [-4, 0] : [0, -4], scale: open ? [0.98, 1] : [1, 0.98] }
      : { opacity: open ? [0, 1] : [1, 0], y: open ? [8, 0] : [0, 8], scale: open ? [0.98, 1] : [1, 0.98] };
  const controls = animate(panel, keyframes, { duration: reduced ? 0 : 0.18, ease: "easeOut" });
  current.stop = () => controls.stop();

  void controls.then(() => {
    const latest = state(panel);
    if (latest.version !== version) return;
    latest.stop = null;
    if (!open) {
      panel.hidden = true;
      panel.style.pointerEvents = "";
      panel.removeAttribute("aria-hidden");
    }
  });
}

export function syncMenubarExamples(doc: Document = document) {
  const panels = doc.querySelectorAll<HTMLElement>(
    '.ariaui-web-preview[data-component="menubar"][data-example-variant="framer-motion"] [data-menubar-motion-content]',
  );
  for (const panel of panels) {
    const current = state(panel);
    const open = panelIsOpen(panel);
    if (!current.initialized) {
      current.initialized = true;
      current.open = open;
    } else if (open !== current.open) {
      animatePanel(panel, open);
    }
  }
}

export function installMenubarExamples(doc: Document = document) {
  syncMenubarExamples(doc);
  if (installedDocuments.has(doc)) return;
  installedDocuments.add(doc);

  new MutationObserver(() => syncMenubarExamples(doc)).observe(doc.documentElement, {
    attributes: true,
    attributeFilter: ["data-state", "hidden", "open", "value"],
    childList: true,
    subtree: true,
  });
}
