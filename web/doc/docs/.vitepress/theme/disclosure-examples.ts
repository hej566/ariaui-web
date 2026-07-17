import { animate } from "framer-motion/dom";

const installedDisclosureExampleDocuments = new WeakSet<Document>();
const installedDisclosureMotionRoots = new WeakSet<HTMLElement>();
const disclosureMotionStates = new WeakMap<HTMLElement, DisclosureMotionState>();

type DisclosureOpenChangeEvent = CustomEvent<{ open: boolean }>;
type DisclosureMotionState = {
  height: number;
  stop: (() => void) | null;
  version: number;
};

function motionState(root: HTMLElement) {
  let state = disclosureMotionStates.get(root);
  if (!state) {
    state = { height: 0, stop: null, version: 0 };
    disclosureMotionStates.set(root, state);
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

function motionRoots(doc: Document) {
  return Array.from(doc.querySelectorAll<HTMLElement>(
    '.ariaui-web-preview[data-component="disclosure"][data-example-variant="framer-motion"] aria-disclosure[data-disclosure-motion]',
  ));
}

function motionContent(root: HTMLElement) {
  return root.querySelector<HTMLElement>("[data-disclosure-motion-content]");
}

function measureContent(content: HTMLElement) {
  if (content.hidden) {
    return 0;
  }

  const inlineHeight = content.style.height;
  content.style.height = "auto";
  const height = content.scrollHeight;
  content.style.height = inlineHeight;
  return height;
}

function preserveMotionHeight(root: HTMLElement) {
  const content = motionContent(root);
  if (!content) {
    return;
  }

  motionState(root).height = content.getBoundingClientRect().height || measureContent(content);
}

function animateMotionContent(root: HTMLElement, open: boolean) {
  const content = motionContent(root);
  if (!content) {
    return;
  }

  const state = motionState(root);
  const version = ++state.version;
  state.stop?.();
  state.stop = null;

  const reduced = reducedMotion(root);
  const fromHeight = open ? 0 : state.height || measureContent(content);
  const toHeight = open ? measureContent(content) : 0;

  content.hidden = false;
  content.style.overflow = "hidden";
  content.style.height = fromHeight + "px";
  content.style.opacity = open ? "0" : "1";
  content.style.pointerEvents = open ? "" : "none";

  const controls = animate(
    content,
    reduced
      ? { opacity: open ? [0, 1] : [1, 0] }
      : {
        height: [fromHeight + "px", toHeight + "px"],
        opacity: open ? [0, 1] : [1, 0],
      },
    {
      duration: reduced ? 0 : 0.2,
      ease: "easeOut",
    },
  );
  state.stop = () => controls.stop();

  void controls.then(() => {
    if (motionState(root).version !== version) {
      return;
    }

    state.stop = null;
    if (root.hasAttribute("open")) {
      content.style.height = "auto";
      content.style.opacity = "";
      content.style.pointerEvents = "";
      state.height = measureContent(content);
    } else {
      content.style.height = "0px";
      content.style.opacity = "0";
      content.style.pointerEvents = "none";
      state.height = 0;
    }
  });
}

export function syncDisclosureExamples(_doc: Document = document) {
  for (const root of motionRoots(_doc)) {
    if (installedDisclosureMotionRoots.has(root)) {
      continue;
    }

    installedDisclosureMotionRoots.add(root);
    preserveMotionHeight(root);
    root.addEventListener("openchange", (event) => {
      const open = (event as DisclosureOpenChangeEvent).detail.open;
      if (!open) {
        preserveMotionHeight(root);
      }
      queueMicrotask(() => animateMotionContent(root, open));
    });
  }
}

export function installDisclosureExamples(doc: Document = document) {
  syncDisclosureExamples(doc);
  if (installedDisclosureExampleDocuments.has(doc)) {
    return;
  }

  installedDisclosureExampleDocuments.add(doc);
  new MutationObserver(() => syncDisclosureExamples(doc)).observe(
    doc.documentElement,
    { childList: true, subtree: true },
  );
}
