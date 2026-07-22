import { animate } from "framer-motion/dom";

const installedDocuments = new WeakSet<Document>();

function updateMotionExample(root: HTMLElement, value: string) {
  root.setAttribute("value", value);
  const list = root.querySelector<HTMLElement>(".ariaui-web-tabs-motion-list");
  const indicator = root.querySelector<HTMLElement>("[data-tabs-motion-indicator]");
  const triggers = Array.from(root.querySelectorAll<HTMLElement>("aria-tabs-trigger"));
  const index = triggers.findIndex((trigger) => trigger.getAttribute("value") === value);
  if (!list || !indicator || index < 0) return;

  const reducedMotion = root.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const x = index * ((list.clientWidth - 8) / triggers.length);
  if (reducedMotion) indicator.style.transform = `translateX(${x}px)`;
  else animate(indicator, { x }, { type: "spring", stiffness: 520, damping: 38, mass: 0.8 });

  const content = root.querySelector<HTMLElement>(`aria-tabs-content[value="${CSS.escape(value)}"] > .ariaui-web-tabs-motion-content`);
  if (content && !reducedMotion) {
    animate(content, { opacity: [0, 1], y: [6, 0] }, { duration: 0.18, ease: "easeOut" });
  }
}

export function installTabsExamples(document = window.document) {
  if (installedDocuments.has(document)) return;
  installedDocuments.add(document);
  document.addEventListener("valuechange", (event) => {
    const root = event.target;
    if (!(root instanceof HTMLElement) || !root.matches(
      '.ariaui-web-preview[data-component="tabs"][data-example-variant="framer-motion"] aria-tabs',
    )) return;
    const value = (event as CustomEvent<{ value?: string }>).detail?.value;
    if (value) updateMotionExample(root, value);
  });
}
