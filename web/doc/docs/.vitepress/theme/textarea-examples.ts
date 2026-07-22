const installedDocuments = new WeakSet<Document>();

export function installTextareaExamples(document = window.document) {
  if (installedDocuments.has(document)) return;
  installedDocuments.add(document);

  document.addEventListener("valuechange", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches(
      '.ariaui-web-preview[data-component="textarea"] aria-textarea[data-textarea-controlled]',
    )) return;
    const root = target as HTMLElement & { value: string };
    const value = (event as CustomEvent<{ value?: string }>).detail?.value;
    if (value !== undefined) {
      root.value = value;
    }
  });
}
