import { animate } from "framer-motion/dom";

const installedDrawerExampleDocuments = new WeakSet<Document>();
const installedDrawerMotionRoots = new WeakSet<HTMLElement>();
const drawerMotionStates = new WeakMap<HTMLElement, { stop: (() => void) | null; version: number }>();

type DrawerOpenChangeEvent = CustomEvent<{ open: boolean }>;
type DrawerSide = "top" | "right" | "bottom" | "left";

const drawerMotionTransition = { duration: 0.22, ease: "easeOut" as const };

function motionState(root: HTMLElement) {
  let state = drawerMotionStates.get(root);
  if (!state) {
    state = { stop: null, version: 0 };
    drawerMotionStates.set(root, state);
  }
  return state;
}

function reducedMotion(root: Element) {
  return root.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function motionRoots(doc: Document) {
  return Array.from(doc.querySelectorAll<HTMLElement>(
    '.ariaui-web-preview[data-component="drawer"][data-example-variant="framer-motion"] aria-drawer[data-drawer-motion]',
  ));
}

function motionOverlay(root: HTMLElement) {
  return root.querySelector<HTMLElement>("[data-drawer-motion-overlay]");
}

function motionContent(root: HTMLElement) {
  return root.querySelector<HTMLElement>("[data-drawer-motion-content]");
}

function drawerSide(content: HTMLElement): DrawerSide {
  const side = content.getAttribute("data-side") ?? content.getAttribute("side") ?? "bottom";
  return side === "top" || side === "right" || side === "bottom" || side === "left" ? side : "bottom";
}

function drawerOffset(side: DrawerSide) {
  return side === "left" || side === "top" ? "-100%" : "100%";
}

function drawerTransform(side: DrawerSide, offset: string) {
  if (side === "left" || side === "right") return `translateX(${offset})`;
  return `translateY(${offset})`;
}

function panelKeyframes(side: DrawerSide, open: boolean) {
  const offset = drawerOffset(side);
  return {
    opacity: open ? [0, 1] : [1, 0],
    transform: open
      ? [drawerTransform(side, offset), drawerTransform(side, "0%")]
      : [drawerTransform(side, "0%"), drawerTransform(side, offset)],
  };
}

function animateDrawerMotion(root: HTMLElement, open: boolean) {
  const overlay = motionOverlay(root);
  const content = motionContent(root);
  if (!overlay || !content) return;
  const state = motionState(root);
  const version = ++state.version;
  state.stop?.();
  state.stop = null;
  const reduced = reducedMotion(root);
  overlay.hidden = false;
  content.hidden = false;
  overlay.style.pointerEvents = open ? "" : "none";
  content.style.pointerEvents = open ? "" : "none";
  const overlayControls = animate(
    overlay,
    { opacity: open ? [0, 1] : [1, 0] },
    { duration: reduced ? 0 : drawerMotionTransition.duration, ease: drawerMotionTransition.ease },
  );
  const contentControls = animate(
    content,
    reduced ? { opacity: open ? [0, 1] : [1, 0] } : panelKeyframes(drawerSide(content), open),
    { duration: reduced ? 0 : drawerMotionTransition.duration, ease: drawerMotionTransition.ease },
  );
  state.stop = () => {
    overlayControls.stop();
    contentControls.stop();
  };
  void Promise.all([overlayControls, contentControls]).then(() => {
    if (motionState(root).version !== version) return;
    state.stop = null;
    if (root.hasAttribute("open")) {
      overlay.style.opacity = "";
      overlay.style.pointerEvents = "";
      content.style.opacity = "";
      content.style.transform = "";
      content.style.pointerEvents = "";
    } else {
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
      content.style.opacity = "0";
      content.style.pointerEvents = "none";
    }
  });
}

export function syncDrawerExamples(doc: Document = document) {
  for (const root of motionRoots(doc)) {
    if (installedDrawerMotionRoots.has(root)) continue;
    installedDrawerMotionRoots.add(root);
    const overlay = motionOverlay(root);
    const content = motionContent(root);
    if (overlay && content && !root.hasAttribute("open")) {
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
      content.style.opacity = "0";
      content.style.pointerEvents = "none";
    }
    root.addEventListener("openchange", (event) => {
      const open = (event as DrawerOpenChangeEvent).detail.open;
      queueMicrotask(() => animateDrawerMotion(root, open));
    });
  }
}

export function installDrawerExamples(doc: Document = document) {
  syncDrawerExamples(doc);
  if (installedDrawerExampleDocuments.has(doc)) return;
  installedDrawerExampleDocuments.add(doc);
  new MutationObserver(() => syncDrawerExamples(doc)).observe(doc.documentElement, { childList: true, subtree: true });
}
