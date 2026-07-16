const installedCommandExampleDocuments = new WeakSet<Document>();

function commandExampleRoots(ownerDocument: Document) {
  return Array.from(ownerDocument.querySelectorAll<HTMLElement>('.ariaui-web-preview[data-component="command"] aria-command'));
}

function syncCommandControlledExample(root: HTMLElement) {
  const output = root.closest(".ariaui-web-preview")?.querySelector<HTMLElement>("[data-command-selected-value]");
  if (!output) {
    return;
  }

  const nextValue = root.getAttribute("value") || "None";
  if (output.textContent === nextValue) {
    return;
  }

  output.textContent = nextValue;
}

export function syncCommandExamples(ownerDocument: Document = document) {
  for (const root of commandExampleRoots(ownerDocument)) {
    syncCommandControlledExample(root);
  }
}

export function installCommandExamples(ownerDocument: Document = document) {
  if (installedCommandExampleDocuments.has(ownerDocument)) {
    return;
  }

  installedCommandExampleDocuments.add(ownerDocument);
  ownerDocument.addEventListener("valuechange", () => syncCommandExamples(ownerDocument));
  ownerDocument.addEventListener("commandselect", () => syncCommandExamples(ownerDocument));

  const observer = new MutationObserver(() => syncCommandExamples(ownerDocument));
  observer.observe(ownerDocument.documentElement, {
    attributes: true,
    attributeFilter: ["value"],
    childList: true,
    subtree: true,
  });

  syncCommandExamples(ownerDocument);
}
