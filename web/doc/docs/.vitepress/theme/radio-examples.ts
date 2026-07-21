const installedRoots = new WeakSet<HTMLElement>();
const observers = new WeakMap<Document, MutationObserver>();

export function syncRadioExamples(ownerDocument: Document = document) {
  for (const root of ownerDocument.querySelectorAll<HTMLElement>(
    '.ariaui-web-preview[data-component="radio"][data-example-variant="controlled"] aria-radio',
  )) {
    if (installedRoots.has(root)) continue;
    root.addEventListener("valuechange", (event) => {
      const value = (event as CustomEvent<{ value?: string }>).detail?.value;
      if (value !== undefined) root.setAttribute("value", value);
    });
    installedRoots.add(root);
  }
}

export function installRadioExamples(ownerDocument: Document = document) {
  syncRadioExamples(ownerDocument);
  if (
    !observers.has(ownerDocument) &&
    typeof MutationObserver !== "undefined"
  ) {
    const observer = new MutationObserver(() =>
      syncRadioExamples(ownerDocument),
    );
    observer.observe(ownerDocument.documentElement, {
      childList: true,
      subtree: true,
    });
    observers.set(ownerDocument, observer);
  }
}
