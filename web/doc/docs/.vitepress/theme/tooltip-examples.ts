import { animate } from "framer-motion/dom";

const installedDocuments = new WeakSet<Document>();
const boundRoots = new WeakSet<HTMLElement>();

type OpenChangeEvent = CustomEvent<{ open: boolean }>;

function tooltipContent(root: HTMLElement) {
  const portal = root.querySelector<HTMLElement>("aria-portal[data-tooltip-portal]");
  const contentId = portal?.dataset.tooltipContent;
  return contentId ? root.ownerDocument.getElementById(contentId) : null;
}

function animateTooltip(root: HTMLElement, open: boolean) {
  const content = tooltipContent(root);
  if (!content) return Promise.resolve();
  const reduced = root.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  content.style.pointerEvents = open ? "" : "none";
  const keyframes = reduced
    ? { opacity: open ? [0, 1] : [1, 0] }
    : {
        opacity: open ? [0, 1] : [1, 0],
        y: open ? [4, 0] : [0, 4],
        scale: open ? [0.96, 1] : [1, 0.96],
      };
  return animate(content, keyframes, { duration: reduced ? 0 : 0.16, ease: "easeOut" }).then(() => undefined);
}

function bindControlledExample(root: HTMLElement) {
  root.addEventListener("openchange", (rawEvent) => {
    const event = rawEvent as OpenChangeEvent;
    const open = event.detail.open;
    event.preventDefault();
    root.toggleAttribute("open", open);
    queueMicrotask(() => {
      const content = tooltipContent(root);
      if (content) content.lastChild!.textContent = open ? "Tooltip is Open" : "Tooltip is Closed";
    });
  });
}

function bindMotionExample(root: HTMLElement) {
  let exitVersion = 0;
  const trigger = root.querySelector<HTMLElement>('button[data-tooltip-trigger-control]');
  trigger?.addEventListener("mouseenter", () => {
    exitVersion += 1;
    if (root.hasAttribute("open")) void animateTooltip(root, true);
  });
  root.addEventListener("openchange", (rawEvent) => {
    const event = rawEvent as OpenChangeEvent;
    if (event.detail.open) {
      exitVersion += 1;
      queueMicrotask(() => void animateTooltip(root, true));
      return;
    }
    event.preventDefault();
    const version = ++exitVersion;
    void animateTooltip(root, false).then(() => {
      if (version === exitVersion) root.toggleAttribute("open", false);
    });
  });
}

export function syncTooltipExamples(doc: Document = document) {
  const roots = Array.from(doc.querySelectorAll<HTMLElement>('.ariaui-web-preview[data-component="tooltip"] aria-tooltip'));
  for (const root of roots) {
    if (boundRoots.has(root)) continue;
    boundRoots.add(root);
    const variant = root.closest<HTMLElement>('[data-example-variant]')?.dataset.exampleVariant;
    if (variant === "controlled") bindControlledExample(root);
    if (variant === "framer-motion") bindMotionExample(root);
  }
}

export function installTooltipExamples(doc: Document = document) {
  syncTooltipExamples(doc);
  if (installedDocuments.has(doc)) return;
  installedDocuments.add(doc);
  new MutationObserver(() => syncTooltipExamples(doc)).observe(doc.documentElement, { childList: true, subtree: true });
}
