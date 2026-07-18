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

function parentMotionPanel(panel: HTMLElement) {
  return panel.parentElement?.closest<HTMLElement>("[data-menubar-motion-content]") ?? null;
}

function settlePanelOpen(panel: HTMLElement) {
  const current = state(panel);
  current.version += 1;
  current.stop?.();
  current.stop = null;
  current.open = true;
  panel.hidden = false;
  panel.style.opacity = "1";
  panel.style.transform = "none";
}

function hidePanel(panel: HTMLElement) {
  const current = state(panel);
  current.version += 1;
  current.stop?.();
  current.stop = null;
  current.open = false;
  panel.hidden = true;
  panel.style.opacity = "";
  panel.style.pointerEvents = "";
  panel.style.transform = "";
  panel.removeAttribute("aria-hidden");
}

function animatePanel(panel: HTMLElement) {
  const current = state(panel);
  const version = ++current.version;
  const isSubmenu = panel.closest("aria-menubar-sub-content") !== null;
  const reduced = reducedMotion(panel);

  current.stop?.();
  current.open = true;
  panel.hidden = false;
  panel.style.pointerEvents = "";
  panel.removeAttribute("aria-hidden");

  const keyframes = reduced
    ? { opacity: [0, 1] }
    : isSubmenu
      ? { opacity: [0, 1], x: [-4, 0], scale: [0.98, 1] }
      : { opacity: [0, 1], y: [8, 0], scale: [0.98, 1] };
  const controls = animate(panel, keyframes, { duration: reduced ? 0 : 0.18, ease: "easeOut" });
  current.stop = () => controls.stop();

  void controls.then(() => {
    const latest = state(panel);
    if (latest.version !== version) return;
    latest.stop = null;
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
      const parent = parentMotionPanel(panel);
      if (open) {
        if (parent) settlePanelOpen(parent);
        animatePanel(panel);
      } else hidePanel(panel);
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
