import { animate } from "framer-motion/dom";

const installedDocuments = new WeakSet<Document>();
const boundRoots = new WeakSet<HTMLElement>();

function motionGroups(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>("[data-treeview-motion-group]"));
}

function initialize(root: HTMLElement) {
  for (const group of motionGroups(root)) group.style.height = group.dataset.expanded === "true" ? "auto" : "0px";
}

function animateGroups(root: HTMLElement) {
  const reduced = root.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  for (const group of motionGroups(root)) {
    const open = group.dataset.expanded === "true";
    const from = group.getBoundingClientRect().height;
    const to = open ? group.scrollHeight : 0;
    group.style.height = `${from}px`;
    void animate(group, { height: [`${from}px`, `${to}px`] }, { duration: reduced ? 0 : 0.2, ease: "linear" }).then(() => {
      group.style.height = open ? "auto" : "0px";
    });
  }
}

function bind(root: HTMLElement) {
  if (boundRoots.has(root)) return;
  boundRoots.add(root);
  if (root.hasAttribute("data-treeview-controlled")) {
    root.addEventListener("expandedchange", (event) => root.setAttribute("expanded", (event as CustomEvent<{ expanded: string[] }>).detail.expanded.join(",")));
    root.addEventListener("valuechange", (event) => {
      const value = (event as CustomEvent<{ value: string | string[] }>).detail.value;
      root.setAttribute("value", Array.isArray(value) ? value.join(",") : value);
    });
  }
  if (root.closest('[data-example-variant="framer-motion"]')) {
    initialize(root);
    root.addEventListener("expandedchange", () => queueMicrotask(() => animateGroups(root)));
  }
}

export function syncTreeviewExamples(doc: Document = document) {
  for (const root of doc.querySelectorAll<HTMLElement>('.ariaui-web-preview[data-component="treeview"] aria-treeview')) bind(root);
}

export function installTreeviewExamples(doc: Document = document) {
  syncTreeviewExamples(doc);
  if (installedDocuments.has(doc)) return;
  installedDocuments.add(doc);
  new MutationObserver(() => syncTreeviewExamples(doc)).observe(doc.documentElement, { childList: true, subtree: true });
}
