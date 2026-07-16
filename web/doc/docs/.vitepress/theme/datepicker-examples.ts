import { animate } from "framer-motion/dom";

const installedDatepickerExampleDocuments = new WeakSet<Document>();
const installedDatepickerMotionRoots = new WeakSet<HTMLElement>();
const datepickerMotionStates = new WeakMap<HTMLElement, DatepickerMotionState>();

type DatepickerOpenChangeEvent = CustomEvent<{ open: boolean }>;
type DatepickerMotionPosition = {
  align: string;
  bottom: string;
  left: string;
  margin: string;
  position: string;
  right: string;
  side: string;
  top: string;
  visibility: string;
  zIndex: string;
};
type DatepickerMotionState = {
  observer: MutationObserver | null;
  position: DatepickerMotionPosition | null;
  stop: (() => void) | null;
  version: number;
};

function motionState(root: HTMLElement) {
  let state = datepickerMotionStates.get(root);
  if (!state) {
    state = { observer: null, position: null, stop: null, version: 0 };
    datepickerMotionStates.set(root, state);
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
    '.ariaui-web-preview[data-component="datepicker"][data-example-variant="framer-motion"] aria-datepicker[data-datepicker-motion]',
  ));
}

function captureMotionPosition(content: HTMLElement): DatepickerMotionPosition {
  return {
    align: content.dataset.align ?? "",
    bottom: content.style.bottom,
    left: content.style.left,
    margin: content.style.margin,
    position: content.style.position,
    right: content.style.right,
    side: content.dataset.side ?? "",
    top: content.style.top,
    visibility: content.style.visibility,
    zIndex: content.style.zIndex,
  };
}

function latestMotionPosition(content: HTMLElement, previous: DatepickerMotionPosition) {
  const current = captureMotionPosition(content);

  return {
    align: previous.align || current.align,
    bottom: previous.bottom || current.bottom,
    left: previous.left || current.left,
    margin: previous.margin || current.margin,
    position: previous.position || current.position,
    right: previous.right || current.right,
    side: previous.side || current.side,
    top: previous.top || current.top,
    visibility: previous.visibility || current.visibility,
    zIndex: previous.zIndex || current.zIndex,
  };
}

function applyMotionPosition(content: HTMLElement, position: DatepickerMotionPosition) {
  const styles: Array<keyof Omit<DatepickerMotionPosition, "align" | "side">> = [
    "bottom",
    "left",
    "margin",
    "position",
    "right",
    "top",
    "visibility",
    "zIndex",
  ];
  for (const style of styles) {
    if (position[style]) {
      content.style[style] = position[style];
    } else {
      content.style.removeProperty(style === "zIndex" ? "z-index" : style);
    }
  }
  if (position.align) content.dataset.align = position.align;
  else delete content.dataset.align;
  if (position.side) content.dataset.side = position.side;
  else delete content.dataset.side;
}

function clearMotionPosition(content: HTMLElement) {
  delete content.dataset.align;
  delete content.dataset.side;
  content.style.removeProperty("bottom");
  content.style.removeProperty("left");
  content.style.removeProperty("margin");
  content.style.removeProperty("position");
  content.style.removeProperty("right");
  content.style.removeProperty("top");
  content.style.removeProperty("visibility");
  content.style.removeProperty("z-index");
}

function motionSide(content: HTMLElement, position: DatepickerMotionPosition | null) {
  return position?.side || content.dataset.side || "bottom";
}

function openKeyframes(side: string) {
  if (side === "top") {
    return {
      opacity: [0, 1],
      y: [0, 0],
      scale: [0.96, 1],
    };
  }

  return {
    opacity: [0, 1],
    y: [8, 0],
    scale: [0.96, 1],
  };
}

function closeKeyframes(side: string) {
  if (side === "top") {
    return {
      opacity: [1, 0],
      y: [0, 0],
      scale: [1, 0.94],
    };
  }

  return {
    opacity: [1, 0],
    y: [0, 12],
    scale: [1, 0.94],
  };
}

function preserveMotionPosition(root: HTMLElement, content: HTMLElement) {
  if (!root.hasAttribute("open") || content.hidden) return;
  motionState(root).position = captureMotionPosition(content);
}

function animateMotionContent(root: HTMLElement, open: boolean) {
  const content = root.querySelector<HTMLElement>("[data-framer-motion-content]");
  if (!content) return;

  const state = motionState(root);
  const version = ++state.version;
  state.stop?.();
  state.stop = null;
  let position = state.position;

  if (open) {
    delete root.dataset.datepickerMotionClosing;
    position = captureMotionPosition(content);
    state.position = position;
  } else if (position) {
    position = latestMotionPosition(content, position);
    state.position = position;
    root.dataset.datepickerMotionClosing = "true";
    applyMotionPosition(content, position);
  }

  const reduced = reducedMotion(root);
  const side = motionSide(content, position);
  content.style.pointerEvents = open ? "" : "none";
  if (!open) {
    content.hidden = false;
  }

  const keyframes = reduced
    ? { opacity: open ? [0, 1] : [1, 0] }
    : open
      ? openKeyframes(side)
      : closeKeyframes(side);

  const controls = animate(content, keyframes, {
    duration: reduced ? 0 : open ? 0.18 : 0.24,
    ease: open ? "easeOut" : "easeIn",
  });
  state.stop = () => controls.stop();

  void controls.then(() => {
    if (motionState(root).version !== version) return;
    state.stop = null;
    if (!root.hasAttribute("open")) {
      content.hidden = true;
      content.style.pointerEvents = "";
      clearMotionPosition(content);
      delete root.dataset.datepickerMotionClosing;
    }
  });
}

export function syncDatepickerExamples(_doc: Document = document) {
  for (const root of motionRoots(_doc)) {
    if (installedDatepickerMotionRoots.has(root)) continue;
    installedDatepickerMotionRoots.add(root);
    const content = root.querySelector<HTMLElement>("[data-framer-motion-content]");
    const state = motionState(root);
    if (content) {
      state.observer = new MutationObserver(() => {
        preserveMotionPosition(root, content);
      });
      state.observer.observe(content, {
        attributeFilter: ["data-align", "data-side", "style"],
        attributes: true,
      });
      root.addEventListener("pointerdown", () => preserveMotionPosition(root, content), true);
      root.addEventListener("click", () => preserveMotionPosition(root, content), true);
      root.addEventListener("keydown", () => preserveMotionPosition(root, content), true);
    }
    root.addEventListener("openchange", (event) => {
      const open = (event as DatepickerOpenChangeEvent).detail.open;
      queueMicrotask(() => animateMotionContent(root, open));
    });
  }
}

export function installDatepickerExamples(doc: Document = document) {
  syncDatepickerExamples(doc);
  if (installedDatepickerExampleDocuments.has(doc)) {
    return;
  }

  installedDatepickerExampleDocuments.add(doc);
  new MutationObserver(() => syncDatepickerExamples(doc)).observe(
    doc.documentElement,
    { childList: true, subtree: true },
  );
}
