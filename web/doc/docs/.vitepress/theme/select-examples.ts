const installedSelectExampleDocuments = new WeakSet<Document>();
const installedSelectScrollAreaRoots = new WeakSet<HTMLElement>();
const pendingSelectExampleDocuments = new WeakSet<Document>();
const pendingSelectScrollAreaCenterRoots = new WeakSet<HTMLElement>();
const pendingSelectScrollAreaScrollRoots = new WeakSet<HTMLElement>();

function selectExampleRoots(doc: Document) {
  return Array.from(doc.querySelectorAll<HTMLElement>('.ariaui-web-preview[data-component="select"] aria-select'));
}

function selectValues(root: HTMLElement) {
  return (root.getAttribute("value") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function writeSelectValues(root: HTMLElement, values: readonly string[]) {
  const nextValues = Array.from(new Set(values.filter(Boolean)));
  if (nextValues.length > 0) {
    root.setAttribute("value", nextValues.join(","));
  } else {
    root.removeAttribute("value");
  }

  root.dispatchEvent(new CustomEvent("valuechange", {
    bubbles: true,
    detail: {
      value: nextValues,
      values: nextValues,
    },
  }));
}

function selectedSelectOptions(root: HTMLElement) {
  const escape = root.ownerDocument.defaultView?.CSS?.escape ?? ((value: string) => value.replaceAll('"', '\\"'));

  return selectValues(root)
    .map((value) => root.querySelector<HTMLElement>(`aria-select-option[value="${escape(value)}"]`))
    .filter((option): option is HTMLElement => Boolean(option));
}

function selectScrollAreaViewport(root: HTMLElement) {
  return root.querySelector<HTMLElement>(".ariaui-web-select-scroll-viewport");
}

function selectScrollAreaOptions(root: HTMLElement) {
  const viewport = selectScrollAreaViewport(root);

  if (!viewport) {
    return [];
  }

  return Array.from(viewport.querySelectorAll<HTMLElement>("aria-select-option"))
    .filter((option) => option.closest("aria-select") === root);
}

function selectOptionLabel(option: HTMLElement) {
  return option.getAttribute("data-select-label")
    ?? (option.textContent ?? "").replace(/[✓×]/g, "").trim();
}

function syncSingleSelectExample(root: HTMLElement) {
  const label = root.querySelector<HTMLElement>("[data-select-trigger-label]");
  const icon = root.querySelector<SVGElement>("[data-select-trigger-icon]");
  const selectedOption = selectedSelectOptions(root)[0] ?? null;

  if (label && selectedOption) {
    const nextLabel = selectOptionLabel(selectedOption);
    if (label.textContent !== nextLabel) {
      label.textContent = nextLabel;
    }
  }

  const selectedIcon = selectedOption?.querySelector<SVGElement>("[data-select-option-icon]");
  if (icon && selectedIcon) {
    const nextViewBox = selectedIcon.getAttribute("viewBox") ?? "0 0 24 24";
    if (icon.getAttribute("viewBox") !== nextViewBox) {
      icon.setAttribute("viewBox", nextViewBox);
    }
    if (icon.innerHTML !== selectedIcon.innerHTML) {
      icon.innerHTML = selectedIcon.innerHTML;
    }
  }
}

function selectOptionValue(option: HTMLElement) {
  return option.getAttribute("value") ?? option.dataset.value ?? "";
}

function setSelectScrollAreaActiveOption(root: HTMLElement, activeOption: HTMLElement | null) {
  for (const option of selectScrollAreaOptions(root)) {
    if (option === activeOption) {
      option.setAttribute("data-scroll-active", "true");
    } else {
      option.removeAttribute("data-scroll-active");
    }
  }
}

function closestSelectScrollAreaOptionToViewportCenter(root: HTMLElement) {
  const viewport = selectScrollAreaViewport(root);
  const options = selectScrollAreaOptions(root);

  if (!viewport || options.length === 0 || viewport.clientHeight <= 0) {
    return selectedSelectOptions(root).find((option) => viewport?.contains(option)) ?? options[0] ?? null;
  }

  const viewportRect = viewport.getBoundingClientRect();
  const viewportCenter = viewportRect.top + viewportRect.height / 2;
  let closestOption: HTMLElement | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const option of options) {
    const rect = option.getBoundingClientRect();
    const optionCenter = rect.top + rect.height / 2;
    const distance = Math.abs(optionCenter - viewportCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestOption = option;
    }
  }

  return closestOption;
}

function selectScrollAreaOption(root: HTMLElement, option: HTMLElement) {
  const value = selectOptionValue(option);

  if (!value) {
    return;
  }

  if (root.getAttribute("value") !== value) {
    root.setAttribute("value", value);
    root.dispatchEvent(new CustomEvent("valuechange", {
      bubbles: true,
      detail: {
        value,
        values: [value],
      },
    }));
  }

  setSelectScrollAreaActiveOption(root, option);
  syncSingleSelectExample(root);
}

function centerSelectScrollAreaOption(root: HTMLElement, option: HTMLElement, behavior: ScrollBehavior = "auto") {
  const viewport = selectScrollAreaViewport(root);

  setSelectScrollAreaActiveOption(root, option);

  if (!viewport || viewport.clientHeight <= 0 || option.offsetHeight <= 0) {
    return;
  }

  const maxScrollTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
  const nextScrollTop = Math.min(
    Math.max(0, option.offsetTop - viewport.clientHeight / 2 + option.offsetHeight / 2),
    maxScrollTop,
  );

  if (typeof viewport.scrollTo === "function") {
    viewport.scrollTo({
      top: nextScrollTop,
      behavior,
    });
  } else {
    viewport.scrollTop = nextScrollTop;
  }
}

function centerSelectedScrollAreaOption(root: HTMLElement, behavior: ScrollBehavior = "auto") {
  const viewport = selectScrollAreaViewport(root);
  const selectedOption = selectedSelectOptions(root).find((option) => viewport?.contains(option))
    ?? selectScrollAreaOptions(root)[0]
    ?? null;

  if (selectedOption) {
    centerSelectScrollAreaOption(root, selectedOption, behavior);
  }
}

function queueSelectedScrollAreaOptionCenter(root: HTMLElement) {
  const defaultView = root.ownerDocument.defaultView;

  if (!defaultView || pendingSelectScrollAreaCenterRoots.has(root)) {
    return;
  }

  pendingSelectScrollAreaCenterRoots.add(root);
  defaultView.requestAnimationFrame(() => {
    pendingSelectScrollAreaCenterRoots.delete(root);
    centerSelectedScrollAreaOption(root);
  });
}

function syncSelectScrollAreaFromViewport(root: HTMLElement) {
  const option = closestSelectScrollAreaOptionToViewportCenter(root);

  if (option) {
    selectScrollAreaOption(root, option);
  }
}

function queueSelectScrollAreaViewportSync(root: HTMLElement) {
  const defaultView = root.ownerDocument.defaultView;

  if (!defaultView || pendingSelectScrollAreaScrollRoots.has(root)) {
    return;
  }

  pendingSelectScrollAreaScrollRoots.add(root);
  defaultView.requestAnimationFrame(() => {
    pendingSelectScrollAreaScrollRoots.delete(root);
    syncSelectScrollAreaFromViewport(root);
  });
}

function installSelectScrollAreaExample(root: HTMLElement) {
  const viewport = selectScrollAreaViewport(root);

  if (!viewport || installedSelectScrollAreaRoots.has(root)) {
    return;
  }

  installedSelectScrollAreaRoots.add(root);

  root.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const option = event.target.closest<HTMLElement>(".ariaui-web-select-scroll-option");
    if (option?.closest("aria-select") === root) {
      event.preventDefault();
      selectScrollAreaOption(root, option);
      centerSelectScrollAreaOption(root, option, "smooth");
      return;
    }

    const button = event.target.closest<HTMLButtonElement>(".ariaui-web-select-scroll-button[data-select-scroll-direction]");
    if (!button || !root.contains(button)) {
      return;
    }

    event.preventDefault();
    const options = selectScrollAreaOptions(root);
    const activeOption = options.find((candidate) => candidate.getAttribute("data-scroll-active") === "true")
      ?? selectedSelectOptions(root).find((candidate) => viewport.contains(candidate))
      ?? options[0]
      ?? null;

    if (!activeOption) {
      return;
    }

    const direction = button.getAttribute("data-select-scroll-direction") === "up" ? -1 : 1;
    const activeIndex = options.indexOf(activeOption);
    const nextIndex = Math.min(Math.max(activeIndex + direction, 0), options.length - 1);
    const nextOption = options[nextIndex] ?? activeOption;

    selectScrollAreaOption(root, nextOption);
    centerSelectScrollAreaOption(root, nextOption, "smooth");
  }, true);

  viewport.addEventListener("scroll", () => queueSelectScrollAreaViewportSync(root), { passive: true });
}

function syncSelectScrollAreaExample(root: HTMLElement) {
  if (!selectScrollAreaViewport(root)) {
    return;
  }

  installSelectScrollAreaExample(root);
  centerSelectedScrollAreaOption(root);

  if (root.hasAttribute("open")) {
    queueSelectedScrollAreaOptionCenter(root);
  }
}

function selectChipLabel(ownerDocument: Document, label: string, value: string) {
  const chip = ownerDocument.createElement("span");
  chip.className = "ariaui-web-select-chip";
  if (value) {
    chip.setAttribute("data-select-chip-value", value);
  }
  chip.textContent = label;

  const remove = ownerDocument.createElement("span");
  remove.className = "ariaui-web-select-remove";
  remove.setAttribute("aria-hidden", "true");
  remove.textContent = "×";
  chip.append(remove);

  return chip;
}

function syncMultipleSelectExample(root: HTMLElement) {
  const selectionGroup = root.querySelector<HTMLElement>(".ariaui-web-select-selection-group");

  if (!selectionGroup) {
    syncSingleSelectExample(root);
    return;
  }

  const selectedOptions = selectedSelectOptions(root);
  const selectedLabels = selectedOptions.map(selectOptionLabel);
  const overflowLimit = Number(root.getAttribute("data-select-overflow-limit"));
  const visibleLimit = Number.isFinite(overflowLimit) && overflowLimit > 0 ? overflowLimit : selectedLabels.length;
  const visibleOptions = selectedOptions.slice(0, visibleLimit);
  const overflowCount = Math.max(0, selectedOptions.length - visibleOptions.length);
  const tagGroup = selectionGroup.querySelector<HTMLElement>(".ariaui-web-select-tag-group") ?? selectionGroup;
  const input = selectionGroup.querySelector<HTMLElement>(".ariaui-web-select-combobox-input");
  const currentLabels = Array.from(tagGroup.querySelectorAll<HTMLElement>(".ariaui-web-select-chip"))
    .map((chip) => (chip.textContent ?? "").replace(/[×]/g, "").trim());
  const currentValues = Array.from(tagGroup.querySelectorAll<HTMLElement>(".ariaui-web-select-chip"))
    .map((chip) => chip.getAttribute("data-select-chip-value") ?? "");
  const visibleLabels = visibleOptions.map(selectOptionLabel);
  const visibleValues = visibleOptions.map(selectOptionValue);
  const currentOverflow = selectionGroup.querySelector<HTMLElement>(".ariaui-web-select-overflow-badge")?.textContent ?? "";
  const nextOverflow = overflowCount > 0 ? `+${overflowCount}` : "";

  if (
    currentLabels.join("\u0000") === visibleLabels.join("\u0000")
    && currentValues.join("\u0000") === visibleValues.join("\u0000")
    && currentOverflow === nextOverflow
  ) {
    return;
  }

  for (const chip of Array.from(tagGroup.querySelectorAll(".ariaui-web-select-chip"))) {
    chip.remove();
  }

  for (const option of visibleOptions) {
    const chip = selectChipLabel(root.ownerDocument, selectOptionLabel(option), selectOptionValue(option));
    if (input && tagGroup === selectionGroup) {
      selectionGroup.insertBefore(chip, input);
    } else {
      tagGroup.append(chip);
    }
  }

  let overflowBadge = selectionGroup.querySelector<HTMLElement>(".ariaui-web-select-overflow-badge");
  if (overflowCount > 0) {
    if (!overflowBadge) {
      overflowBadge = root.ownerDocument.createElement("span");
      overflowBadge.className = "ariaui-web-select-overflow-badge";
      selectionGroup.insertBefore(overflowBadge, input ?? null);
    }
    overflowBadge.textContent = `+${overflowCount}`;
  } else {
    overflowBadge?.remove();
  }
}

export function syncSelectExamples(doc: Document = document) {
  for (const root of selectExampleRoots(doc)) {
    if ((root.getAttribute("selection-mode") ?? root.getAttribute("selectionMode")) === "multiple") {
      syncMultipleSelectExample(root);
    } else {
      syncSingleSelectExample(root);
    }
    syncSelectScrollAreaExample(root);
  }
}

function queueSelectExampleSync(doc: Document) {
  const defaultView = doc.defaultView;

  if (!defaultView || pendingSelectExampleDocuments.has(doc)) {
    return;
  }

  pendingSelectExampleDocuments.add(doc);
  defaultView.requestAnimationFrame(() => {
    pendingSelectExampleDocuments.delete(doc);
    syncSelectExamples(doc);
  });
}

export function installSelectExamples(doc: Document = document) {
  if (installedSelectExampleDocuments.has(doc)) {
    return;
  }

  installedSelectExampleDocuments.add(doc);
  const scheduleSync = () => queueSelectExampleSync(doc);

  doc.addEventListener("valuechange", scheduleSync);
  doc.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const remove = event.target.closest<HTMLElement>(".ariaui-web-select-remove");
    const chip = remove?.closest<HTMLElement>(".ariaui-web-select-chip[data-select-chip-value]");

    if (!chip) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    removeSelectChipValue(chip);
  }, true);
  new MutationObserver(scheduleSync).observe(doc.documentElement, {
    attributes: true,
    attributeFilter: ["value", "data-state"],
    childList: true,
    subtree: true,
  });
  scheduleSync();
}

function removeSelectChipValue(chip: HTMLElement) {
  const value = chip.getAttribute("data-select-chip-value");
  const root = chip.closest<HTMLElement>("aria-select");

  if (!value || !root || !root.closest('.ariaui-web-preview[data-component="select"]')) {
    return;
  }

  writeSelectValues(root, selectValues(root).filter((candidate) => candidate !== value));
  syncMultipleSelectExample(root);
}
