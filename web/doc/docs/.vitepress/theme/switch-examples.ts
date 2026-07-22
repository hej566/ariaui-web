import { animate } from "framer-motion/dom";

const installedDocuments = new WeakSet<Document>();

function setMotionThumb(root: HTMLElement, checked: boolean) {
  const thumb = root.querySelector<HTMLElement>("[data-switch-motion-thumb]");
  if (!thumb) return;

  const reducedMotion = root.ownerDocument.defaultView
    ?.matchMedia?.("(prefers-reduced-motion: reduce)")
    .matches;
  if (reducedMotion) {
    thumb.style.transform = `translateX(${checked ? 16 : 0}px)`;
    return;
  }

  animate(
    thumb,
    { x: checked ? 16 : 0 },
    { type: "spring", stiffness: 500, damping: 32 },
  );
}

export function installSwitchExamples(document = window.document) {
  if (installedDocuments.has(document)) return;
  installedDocuments.add(document);

  document.addEventListener("checkedchange", (event) => {
    const root = event.target;
    if (!(root instanceof HTMLElement) || !root.matches(
      '.ariaui-web-preview[data-component="switch"][data-example-variant="framer-motion"] aria-switch',
    )) return;

    const checked = (event as CustomEvent<{ checked?: boolean }>).detail?.checked;
    setMotionThumb(root, checked ?? root.hasAttribute("checked"));
  });
}
