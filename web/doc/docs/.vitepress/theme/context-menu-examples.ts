import { animate } from "framer-motion/dom";

type MotionSubContentState = {
  initialized: boolean;
  open: boolean;
  exiting: boolean;
  stop: (() => void) | null;
  version: number;
};

const installedDocuments = new WeakSet<Document>();
const motionSubContentStates = new WeakMap<HTMLElement, MotionSubContentState>();

function motionSubContents(doc: Document) {
  return Array.from(doc.querySelectorAll<HTMLElement>(".ariaui-web-context-menu-motion-sub-content"));
}

function contextMenuExamplePortalOwner(content: HTMLElement) {
  if (!content.id) {
    return null;
  }

  const escape = content.ownerDocument.defaultView?.CSS?.escape
    ?? ((value: string) => value.replaceAll('"', '\\"'));
  return content.ownerDocument.querySelector<HTMLElement>(
    `aria-portal[data-context-menu-portal-content="${escape(content.id)}"]`,
  )?.parentElement ?? null;
}

function motionState(content: HTMLElement) {
  let state = motionSubContentStates.get(content);
  if (!state) {
    state = { initialized: false, open: false, exiting: false, stop: null, version: 0 };
    motionSubContentStates.set(content, state);
  }

  return state;
}

function reducedMotion(element: Element) {
  return element.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function requestContextMenuExampleFrame(content: HTMLElement, callback: () => void) {
  const defaultView = content.ownerDocument.defaultView;
  let called = false;
  const run = () => {
    if (called) {
      return;
    }

    called = true;
    callback();
  };

  if (typeof defaultView?.requestAnimationFrame === "function") {
    defaultView.requestAnimationFrame(run);
  }

  if (typeof defaultView?.setTimeout === "function") {
    defaultView.setTimeout(run, 0);
  } else {
    setTimeout(run, 0);
  }
}

function isSubContentOpen(content: HTMLElement) {
  const sub = content.closest("aria-context-menu-sub") ?? contextMenuExamplePortalOwner(content);
  return sub?.matches("aria-context-menu-sub") === true && sub.hasAttribute("open") && !content.hidden;
}

function animateMotionSubContent(content: HTMLElement, open: boolean, version: number) {
  const state = motionState(content);
  const reduced = reducedMotion(content);

  state.stop?.();
  state.stop = null;
  content.hidden = false;

  if (open) {
    state.open = true;
    state.exiting = false;
    content.removeAttribute("aria-hidden");
    content.style.pointerEvents = "";
  } else {
    state.open = false;
    state.exiting = true;
    content.setAttribute("aria-hidden", "true");
    content.style.pointerEvents = "none";
  }

  const controls = animate(
    content,
    reduced
      ? { opacity: open ? [0, 1] : [1, 0] }
      : {
          opacity: open ? [0, 1] : [1, 0],
          scale: open ? [0.96, 1] : [1, 0.96],
        },
    { duration: reduced ? 0 : 0.18, ease: "easeOut" },
  );

  state.stop = () => controls.stop();

  if (!open) {
    void controls.then(() => {
      const current = motionState(content);
      if (current.version !== version) {
        return;
      }

      current.exiting = false;
      current.stop = null;
      content.hidden = true;
      content.removeAttribute("aria-hidden");
      content.style.pointerEvents = "";
    });
    return;
  }

  void controls.then(() => {
    const current = motionState(content);
    if (current.version === version) {
      current.stop = null;
    }
  });
}

function scheduleMotionSubContentAnimation(content: HTMLElement, open: boolean) {
  const state = motionState(content);
  const version = ++state.version;

  if (open) {
    state.open = true;
    state.exiting = false;
    content.removeAttribute("aria-hidden");
    content.style.pointerEvents = "";
  } else {
    state.open = false;
    state.exiting = true;
    content.setAttribute("aria-hidden", "true");
    content.style.pointerEvents = "none";
  }

  requestContextMenuExampleFrame(content, () => {
    if (motionState(content).version !== version) {
      return;
    }

    animateMotionSubContent(content, open, version);
  });
}

export function syncContextMenuExamples(doc: Document = document) {
  for (const content of motionSubContents(doc)) {
    const state = motionState(content);
    const open = isSubContentOpen(content);

    if (!state.initialized) {
      state.initialized = true;
      state.open = open;
      continue;
    }

    if (open && (!state.open || state.exiting)) {
      scheduleMotionSubContentAnimation(content, true);
      continue;
    }

    if (!open && state.open && !state.exiting) {
      scheduleMotionSubContentAnimation(content, false);
    }
  }
}

export function installContextMenuExamples(doc: Document = document) {
  syncContextMenuExamples(doc);
  if (installedDocuments.has(doc)) {
    return;
  }

  installedDocuments.add(doc);
  new MutationObserver(() => syncContextMenuExamples(doc)).observe(doc.documentElement, {
    attributes: true,
    attributeFilter: ["hidden", "open"],
    childList: true,
    subtree: true,
  });
}
