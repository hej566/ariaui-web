import { animate } from "framer-motion/dom";

const animatedSpinners = new WeakSet<Element>();
const installedDocuments = new WeakSet<Document>();

function installMotionSpinner(spinner: Element) {
  if (animatedSpinners.has(spinner)) return;
  animatedSpinners.add(spinner);

  const reducedMotion = spinner.ownerDocument.defaultView
    ?.matchMedia?.("(prefers-reduced-motion: reduce)")
    .matches;
  if (reducedMotion) return;

  animate(
    spinner,
    { rotate: 360 },
    { duration: 0.9, ease: "linear", repeat: Infinity },
  );
}

function scan(document: Document) {
  for (const spinner of document.querySelectorAll(
    '.ariaui-web-preview[data-component="spinner"] [data-spinner-motion]',
  )) {
    installMotionSpinner(spinner);
  }
}

export function installSpinnerExamples(document = window.document) {
  scan(document);
  if (installedDocuments.has(document)) return;
  installedDocuments.add(document);

  new MutationObserver(() => scan(document)).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
