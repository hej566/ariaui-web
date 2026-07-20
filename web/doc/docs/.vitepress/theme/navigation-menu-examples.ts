import { animate } from "framer-motion/dom";

const installedNavigationMenuExampleDocuments = new WeakSet<Document>();
const installedNavigationMenuMotionRoots = new WeakSet<HTMLElement>();
const navigationMenuMotionStates = new WeakMap<HTMLElement, { stop: (() => void) | null; version: number }>();

type NavigationMenuValueChangeEvent = CustomEvent<{ value: string }>;

const transition = { duration: 0.18, ease: "easeOut" as const };

function motionState(panel: HTMLElement) {
  let state = navigationMenuMotionStates.get(panel);
  if (!state) {
    state = { stop: null, version: 0 };
    navigationMenuMotionStates.set(panel, state);
  }
  return state;
}

function reducedMotion(root: Element) {
  return root.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function motionRoots(doc: Document) {
  return Array.from(doc.querySelectorAll<HTMLElement>(
    '.ariaui-web-preview[data-component="navigation-menu"][data-example-variant="framer-motion"] aria-navigation-menu[data-navigation-menu-motion]',
  ));
}

function motionPanels(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>("[data-navigation-menu-motion-content]"));
}

function panelOpen(panel: HTMLElement) {
  return panel.getAttribute("data-state") === "open" && panel.getAttribute("aria-hidden") !== "true";
}

function primePanel(panel: HTMLElement) {
  if (panelOpen(panel)) {
    panel.style.opacity = "";
    panel.style.transform = "";
    panel.style.visibility = "";
    panel.style.pointerEvents = "";
  } else {
    panel.style.opacity = "0";
    panel.style.transform = "translateY(8px) scale(0.98)";
    panel.style.visibility = "hidden";
    panel.style.pointerEvents = "none";
  }
}

function animatePanel(root: HTMLElement, panel: HTMLElement) {
  const open = panelOpen(panel);
  const state = motionState(panel);
  const version = ++state.version;
  state.stop?.();
  state.stop = null;

  panel.hidden = false;
  panel.style.visibility = "visible";
  panel.style.pointerEvents = open ? "" : "none";

  const controls = animate(
    panel,
    reducedMotion(root)
      ? { opacity: open ? [0, 1] : [1, 0] }
      : {
        opacity: open ? [0, 1] : [1, 0],
        transform: open
          ? ["translateY(8px) scale(0.98)", "translateY(0px) scale(1)"]
          : ["translateY(0px) scale(1)", "translateY(8px) scale(0.98)"],
      },
    { duration: reducedMotion(root) ? 0 : transition.duration, ease: transition.ease },
  );
  state.stop = () => controls.stop();

  void controls.then(() => {
    if (motionState(panel).version !== version) return;
    state.stop = null;
    if (panelOpen(panel)) {
      panel.style.opacity = "";
      panel.style.transform = "";
      panel.style.visibility = "";
      panel.style.pointerEvents = "";
    } else {
      panel.style.opacity = "0";
      panel.style.transform = "translateY(8px) scale(0.98)";
      panel.style.visibility = "hidden";
      panel.style.pointerEvents = "none";
    }
  });
}

function syncRoot(root: HTMLElement, animate = false) {
  for (const panel of motionPanels(root)) {
    if (animate) animatePanel(root, panel);
    else primePanel(panel);
  }
}

export function syncNavigationMenuExamples(doc: Document = document) {
  for (const root of motionRoots(doc)) {
    if (installedNavigationMenuMotionRoots.has(root)) {
      syncRoot(root, false);
      continue;
    }

    installedNavigationMenuMotionRoots.add(root);
    syncRoot(root, false);
    root.addEventListener("valuechange", (event) => {
      void (event as NavigationMenuValueChangeEvent).detail.value;
      queueMicrotask(() => syncRoot(root, true));
    });
    root.addEventListener("openchange", () => {
      queueMicrotask(() => syncRoot(root, true));
    });
  }
}

export function installNavigationMenuExamples(doc: Document = document) {
  syncNavigationMenuExamples(doc);
  if (installedNavigationMenuExampleDocuments.has(doc)) return;
  installedNavigationMenuExampleDocuments.add(doc);
  new MutationObserver(() => syncNavigationMenuExamples(doc)).observe(doc.documentElement, {
    attributes: true,
    attributeFilter: ["data-state", "aria-hidden", "hidden", "value", "open"],
    childList: true,
    subtree: true,
  });
}
