import { animate } from "framer-motion/dom";

const installedDocuments = new WeakSet<Document>();
const boundRoots = new WeakSet<HTMLElement>();

type OpenChangeEvent = CustomEvent<{ open: boolean }>;

function motionRoots(doc: Document) {
  return Array.from(doc.querySelectorAll<HTMLElement>(
    '.ariaui-web-preview[data-component="popover"][data-example-variant="framer-motion"] aria-popover',
  ));
}

function animateMotionPopover(root: HTMLElement, open: boolean) {
  const content = root.querySelector<HTMLElement>("aria-popover-content");
  if (!content) return;
  const reduced = root.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  content.style.pointerEvents = open ? "" : "none";
  if (reduced) content.style.transform = "";
  const keyframes = reduced
    ? { opacity: open ? [0, 1] : [1, 0] }
    : {
        opacity: open ? [0, 1] : [1, 0],
        y: open ? [8, 0] : [0, 8],
        scale: open ? [0.96, 1] : [1, 0.96],
      };
  void animate(content, keyframes, { duration: reduced ? 0 : 0.18, ease: "easeOut" });
}

export function syncPopoverExamples(doc: Document = document) {
  for (const root of motionRoots(doc)) {
    if (boundRoots.has(root)) continue;
    boundRoots.add(root);
    root.addEventListener("openchange", (event) => {
      const open = (event as OpenChangeEvent).detail.open;
      queueMicrotask(() => animateMotionPopover(root, open));
    });
    const initiallyOpen = root.hasAttribute("open");
    if (initiallyOpen) animateMotionPopover(root, true);
    else {
      const content = root.querySelector<HTMLElement>("aria-popover-content");
      if (content) {
        const reduced = root.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
        content.style.opacity = "0";
        content.style.transform = reduced ? "" : "translateY(8px) scale(0.96)";
        content.style.pointerEvents = "none";
      }
    }
  }
}

export function installPopoverExamples(doc: Document = document) {
  syncPopoverExamples(doc);
  if (installedDocuments.has(doc)) return;
  installedDocuments.add(doc);
  new MutationObserver(() => syncPopoverExamples(doc)).observe(doc.documentElement, { childList: true, subtree: true });
}
