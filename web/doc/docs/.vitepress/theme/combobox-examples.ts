const installedComboboxExampleDocuments = new WeakSet<Document>();
const pendingComboboxExampleDocuments = new WeakSet<Document>();
const comboboxExampleOffset = 5;
const comboboxExamplePadding = 8;
const comboboxChipClass = "ariaui-web-combobox-chip inline-flex flex-none items-center gap-1 whitespace-nowrap rounded-md bg-[var(--vp-c-bg-soft)] px-1.5 py-0.5 text-xs leading-4 font-medium text-[var(--vp-c-text-1)]";
const comboboxAvatarClass = "ariaui-web-combobox-avatar size-5 flex-none rounded-full object-cover";
const comboboxChipLabelClass = "ariaui-web-combobox-chip-label min-w-0 overflow-hidden text-ellipsis whitespace-nowrap";
const comboboxRemoveClass = "ariaui-web-combobox-remove inline-flex size-3.5 items-center justify-center rounded-full text-[var(--vp-c-text-1)] opacity-[.78] hover:bg-[color-mix(in_srgb,var(--vp-c-text-2)_12%,transparent)]";
const comboboxOverflowCountClass = "ariaui-web-combobox-overflow-count inline-flex shrink-0 flex-row flex-nowrap items-center whitespace-nowrap py-0.5 text-xs leading-4 font-medium text-[var(--vp-c-text-2)]";

type ComboboxExampleRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

type ComboboxExampleViewport = {
  width: number;
  height: number;
};

export type ComboboxExamplePosition = {
  top: number;
  left: number;
  side: "top" | "bottom";
  align: "start";
};

function clamp(value: number, min: number, max: number) {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

export function computeComboboxExamplePosition(
  reference: ComboboxExampleRect,
  floating: Pick<ComboboxExampleRect, "width" | "height">,
  viewport: ComboboxExampleViewport,
): ComboboxExamplePosition {
  const belowSpace = viewport.height - reference.bottom - comboboxExamplePadding;
  const aboveSpace = reference.top - comboboxExamplePadding;
  const side = reference.bottom + comboboxExampleOffset + floating.height > viewport.height - comboboxExamplePadding
    && aboveSpace >= belowSpace
    ? "top"
    : "bottom";
  const top = side === "bottom"
    ? reference.bottom + comboboxExampleOffset
    : reference.top - comboboxExampleOffset - floating.height;

  return {
    top,
    left: clamp(reference.left, comboboxExamplePadding, viewport.width - floating.width - comboboxExamplePadding),
    side,
    align: "start",
  };
}

function setComboboxExamplePosition(element: HTMLElement, position: ComboboxExamplePosition) {
  element.dataset.side = position.side;
  element.dataset.align = position.align;
  element.style.top = position.top + "px";
  element.style.left = position.left + "px";
}

function clearComboboxExamplePosition(element: HTMLElement) {
  delete element.dataset.side;
  delete element.dataset.align;
  element.style.removeProperty("top");
  element.style.removeProperty("left");
}

function requestComboboxExampleFrame(defaultView: Window, callback: () => void) {
  let called = false;
  const run = () => {
    if (called) {
      return;
    }
    called = true;
    callback();
  };

  if (typeof defaultView.requestAnimationFrame === "function") {
    defaultView.requestAnimationFrame(run);
  }
  defaultView.setTimeout(run, 0);
}

function comboboxExampleRoots(doc: Document) {
  return Array.from(doc.querySelectorAll<HTMLElement>('.ariaui-web-preview[data-component="combobox"] aria-combobox'));
}

function comboboxValues(root: HTMLElement) {
  return (root.getAttribute("value") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function writeComboboxValues(root: HTMLElement, values: readonly string[]) {
  const nextValues = Array.from(new Set(values.filter(Boolean)));
  if (nextValues.length > 0) {
    root.setAttribute("value", nextValues.join(","));
  } else {
    root.removeAttribute("value");
  }

  root.dispatchEvent(new CustomEvent("valuechange", {
    bubbles: true,
    detail: {
      value: root.getAttribute("selection-mode") === "multiple" ? nextValues : nextValues[0] ?? "",
      values: nextValues,
    },
  }));
}

function optionValue(option: HTMLElement) {
  return option.getAttribute("value") ?? option.dataset.value ?? "";
}

function optionLabel(option: HTMLElement) {
  return option.getAttribute("data-combobox-label")
    ?? (option.textContent ?? "").replace(/[✓×]/g, "").trim();
}

function selectedComboboxOptions(root: HTMLElement) {
  const escape = root.ownerDocument.defaultView?.CSS?.escape ?? ((value: string) => value.replaceAll('"', '\\"'));

  return comboboxValues(root)
    .map((value) => root.querySelector<HTMLElement>(`aria-combobox-option[value="${escape(value)}"]`))
    .filter((option): option is HTMLElement => Boolean(option));
}

function syncComboboxInputPlaceholder(root: HTMLElement, selectedCount: number) {
  const input = root.querySelector<HTMLElement>("aria-combobox-input");
  if (!input) {
    return;
  }

  if (selectedCount > 0) {
    input.setAttribute("placeholder", "");
  } else if (!input.getAttribute("placeholder")) {
    input.setAttribute("placeholder", "Search...");
  }
}

function syncSingleComboboxExample(root: HTMLElement) {
  const label = root.querySelector<HTMLElement>("[data-combobox-trigger-label]");
  const selectedOption = selectedComboboxOptions(root)[0] ?? null;

  if (label) {
    label.textContent = selectedOption ? optionLabel(selectedOption) : "";
  }

  syncComboboxInputPlaceholder(root, selectedOption ? 1 : 0);
}

function chipLabel(ownerDocument: Document, option: HTMLElement, removable = true) {
  const chip = ownerDocument.createElement("span");
  chip.className = comboboxChipClass;
  chip.setAttribute("data-combobox-chip-value", optionValue(option));

  const avatar = option.getAttribute("data-combobox-avatar");
  if (avatar) {
    const image = ownerDocument.createElement("img");
    image.className = comboboxAvatarClass;
    image.src = avatar;
    image.alt = "";
    chip.append(image);
  }

  const text = ownerDocument.createElement("span");
  text.className = comboboxChipLabelClass;
  text.textContent = optionLabel(option);
  chip.append(text);

  if (removable) {
    const remove = ownerDocument.createElement("span");
    remove.className = comboboxRemoveClass;
    remove.setAttribute("aria-hidden", "true");
    remove.textContent = "×";
    chip.append(remove);
  }

  return chip;
}

function syncComboboxChips(root: HTMLElement) {
  const selectionGroup = root.querySelector<HTMLElement>(".ariaui-web-combobox-selection-group, .ariaui-web-combobox-advanced-selection-group");
  const tagGroup = root.querySelector<HTMLElement>(".ariaui-web-combobox-tag-group, .ariaui-web-combobox-advanced-tag-group") ?? selectionGroup;

  if (!tagGroup) {
    syncSingleComboboxExample(root);
    return;
  }

  const selectedOptions = selectedComboboxOptions(root);
  const selectedSignature = selectedOptions.map(optionValue).join("\u0000");
  const renderedSignature = tagGroup.getAttribute("data-combobox-rendered-values") ?? "";
  const overflowLimit = Number(root.getAttribute("data-combobox-overflow-limit"));
  const visibleLimit = Number.isFinite(overflowLimit) && overflowLimit > 0 ? overflowLimit : selectedOptions.length;
  const visibleOptions = selectedOptions.slice(0, visibleLimit);
  const overflowCount = Math.max(0, selectedOptions.length - visibleOptions.length);

  if (renderedSignature !== selectedSignature) {
    tagGroup.replaceChildren(...visibleOptions.map((option) => chipLabel(root.ownerDocument, option)));
    tagGroup.setAttribute("data-combobox-rendered-values", selectedSignature);
  }

  let overflow = selectionGroup?.querySelector<HTMLElement>(".ariaui-web-combobox-overflow-count") ?? null;
  if (overflowCount > 0 && selectionGroup) {
    if (!overflow) {
      overflow = root.ownerDocument.createElement("span");
      overflow.className = comboboxOverflowCountClass;
      selectionGroup.insertBefore(overflow, root.querySelector("aria-combobox-input"));
    }
    overflow.textContent = `+${overflowCount}`;
    overflow.setAttribute("aria-label", `${overflowCount} more selected`);
  } else {
    overflow?.remove();
  }

  syncComboboxInputPlaceholder(root, selectedOptions.length);
}

function syncComboboxMotionExample(root: HTMLElement) {
  const content = root.querySelector<HTMLElement>("aria-combobox-content");
  if (!content || !root.closest('[data-example-variant="framer-motion"]')) {
    return;
  }

  content.setAttribute("force-mount", "");
  content.setAttribute("data-state", root.hasAttribute("open") ? "open" : "closed");
  content.hidden = false;
}

function positionComboboxExampleContent(root: HTMLElement) {
  const ownerDocument = root.ownerDocument;
  const defaultView = ownerDocument.defaultView;
  const trigger = root.querySelector<HTMLElement>(":scope > aria-combobox-trigger");
  const content = root.querySelector<HTMLElement>(":scope > aria-combobox-content");

  if (!defaultView || !trigger || !content) {
    return;
  }

  if (content.hidden || !root.hasAttribute("open")) {
    clearComboboxExamplePosition(content);
    return;
  }

  setComboboxExamplePosition(content, computeComboboxExamplePosition(
    trigger.getBoundingClientRect(),
    content.getBoundingClientRect(),
    {
      width: defaultView.innerWidth,
      height: defaultView.innerHeight,
    },
  ));
}

export function syncComboboxExamples(doc: Document = document) {
  for (const root of comboboxExampleRoots(doc)) {
    if ((root.getAttribute("selection-mode") ?? root.getAttribute("selectionMode")) === "multiple") {
      syncComboboxChips(root);
    } else if (root.querySelector(".ariaui-web-combobox-tag-group")) {
      syncComboboxChips(root);
    } else {
      syncSingleComboboxExample(root);
    }

    syncComboboxMotionExample(root);
    positionComboboxExampleContent(root);
  }
}

function queueComboboxExampleSync(doc: Document) {
  const defaultView = doc.defaultView;

  if (!defaultView || pendingComboboxExampleDocuments.has(doc)) {
    return;
  }

  pendingComboboxExampleDocuments.add(doc);
  requestComboboxExampleFrame(defaultView, () => {
    pendingComboboxExampleDocuments.delete(doc);
    syncComboboxExamples(doc);
  });
}

export function installComboboxExamples(doc: Document = document) {
  if (installedComboboxExampleDocuments.has(doc)) {
    return;
  }

  installedComboboxExampleDocuments.add(doc);
  const scheduleSync = () => queueComboboxExampleSync(doc);

  doc.addEventListener("valuechange", scheduleSync);
  doc.addEventListener("inputvaluechange", scheduleSync);
  doc.addEventListener("openchange", scheduleSync);
  doc.addEventListener("keydown", scheduleSync, true);
  doc.addEventListener("input", scheduleSync, true);
  doc.addEventListener("pointerdown", scheduleSync, true);
  doc.addEventListener("click", scheduleSync, true);
  doc.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const remove = event.target.closest<HTMLElement>(".ariaui-web-combobox-remove");
    const chip = remove?.closest<HTMLElement>(".ariaui-web-combobox-chip[data-combobox-chip-value]");

    if (!chip) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    removeComboboxChipValue(chip);
  }, true);

  const defaultView = doc.defaultView;
  defaultView?.addEventListener("resize", scheduleSync);
  defaultView?.addEventListener("scroll", scheduleSync, true);
  new MutationObserver(() => scheduleSync()).observe(doc.documentElement, {
    attributes: true,
    attributeFilter: ["value", "data-state", "hidden", "open"],
    childList: true,
    subtree: true,
  });
  scheduleSync();
}

function removeComboboxChipValue(chip: HTMLElement) {
  const value = chip.getAttribute("data-combobox-chip-value");
  const root = chip.closest<HTMLElement>("aria-combobox");

  if (!value || !root || !root.closest('.ariaui-web-preview[data-component="combobox"]')) {
    return;
  }

  writeComboboxValues(root, comboboxValues(root).filter((candidate) => candidate !== value));
  syncComboboxChips(root);
}
