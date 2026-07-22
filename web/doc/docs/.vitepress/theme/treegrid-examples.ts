import { animate } from "framer-motion/dom";

const installedDocuments = new WeakSet<Document>();
const boundRoots = new WeakSet<HTMLElement>();

function motionGroups(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>("[data-treegrid-motion-group]"));
}

function expanded(group: HTMLElement) {
  return group.dataset.expanded === "true";
}

function initializeMotionRoot(root: HTMLElement) {
  for (const group of motionGroups(root)) {
    group.style.height = expanded(group) ? "auto" : "0px";
  }
}

function animateMotionRoot(root: HTMLElement) {
  const reduced = root.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  for (const group of motionGroups(root)) {
    const open = expanded(group);
    const from = group.getBoundingClientRect().height;
    const to = open ? group.scrollHeight : 0;
    group.style.height = `${from}px`;
    void animate(group, { height: [`${from}px`, `${to}px`] }, { duration: reduced ? 0 : 0.2, ease: "linear" }).then(() => {
      group.style.height = open ? "auto" : "0px";
    });
  }
}

function bindTreegridExample(root: HTMLElement) {
  if (boundRoots.has(root)) return;
  boundRoots.add(root);
  if (root.closest('[data-example-variant="framer-motion"]')) {
    initializeMotionRoot(root);
    root.addEventListener("expandedchange", () => queueMicrotask(() => animateMotionRoot(root)));
  }
}

export function syncTreegridExamples(doc: Document = document) {
  for (const root of doc.querySelectorAll<HTMLElement>('.ariaui-web-preview[data-component="treegrid"] aria-treegrid')) {
    bindTreegridExample(root);
  }
}

export function installTreegridExamples(doc: Document = document) {
  syncTreegridExamples(doc);
  if (installedDocuments.has(doc)) return;
  installedDocuments.add(doc);
  new MutationObserver(() => syncTreegridExamples(doc)).observe(doc.documentElement, { childList: true, subtree: true });
}
