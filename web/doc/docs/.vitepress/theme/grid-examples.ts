const installedGridRoots = new WeakSet<HTMLElement>();
let gridExamplesObserver: MutationObserver | null = null;

function selectedValues(root: HTMLElement) {
  return (root.getAttribute("value") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function renderSelectionSummary(summary: HTMLElement, values: readonly string[]) {
  const label = document.createElement("span");
  label.className = "font-medium text-foreground";
  label.textContent = "Selected values";

  const chips = (values.length > 0 ? values : ["None"]).map((value) => {
    const chip = document.createElement("span");
    chip.className = "rounded-md bg-accent px-2 py-1 font-medium text-foreground";
    chip.textContent = value;
    return chip;
  });

  summary.replaceChildren(label, ...chips);
}

export function syncGridExample(preview: HTMLElement) {
  const root = preview.querySelector<HTMLElement>("aria-grid");
  const summary = preview.querySelector<HTMLElement>("[data-grid-selected-values]");
  if (!root || !summary) {
    return;
  }

  if (installedGridRoots.has(root)) {
    return;
  }

  renderSelectionSummary(summary, selectedValues(root));

  root.addEventListener("valuechange", (event) => {
    const values = (event as CustomEvent<{ value?: string[] }>).detail?.value ?? [];
    if (preview.dataset.exampleVariant === "controlled") {
      root.setAttribute("value", values.join(","));
    }
    renderSelectionSummary(summary, values);
  });
  installedGridRoots.add(root);
}

export function installGridExamples() {
  const syncExamples = () => {
    for (const preview of document.querySelectorAll<HTMLElement>('.ariaui-web-preview[data-component="grid"]')) {
      syncGridExample(preview);
    }
  };

  syncExamples();

  if (!gridExamplesObserver && typeof MutationObserver !== "undefined") {
    gridExamplesObserver = new MutationObserver(syncExamples);
    gridExamplesObserver.observe(document.documentElement, { childList: true, subtree: true });
  }
}
