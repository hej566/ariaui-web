import { computePrePositionStyle } from "@ariaui-web/position";

const installedSelectExampleDocuments = new WeakSet<Document>();
const installedSelectScrollAreaRoots = new WeakSet<HTMLElement>();
const pendingSelectExampleDocuments = new WeakSet<Document>();
const pendingSelectScrollAreaCenterRoots = new WeakSet<HTMLElement>();
const pendingSelectScrollAreaScrollRoots = new WeakSet<HTMLElement>();
const selectExampleScrollStates = new WeakMap<Document, { bodyOverflow: string; documentOverflow: string }>();
let selectScrollAreaOptionId = 0;
const selectExampleOffset = 5;
const selectExamplePadding = 8;
const selectExampleOpenRootSelector = [
  '.ariaui-web-preview[data-component="select"] aria-select[open]',
  '.ariaui-web-preview[data-component="calendar"] aria-select[data-calendar-select][open]',
  '.ariaui-web-preview[data-component="sidebar"] aria-select[open]',
].join(", ");

type SelectExampleRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

type SelectExampleViewport = {
  width: number;
  height: number;
};

export type SelectExamplePosition = {
  top: number;
  left: number;
  side: "top" | "right" | "bottom" | "left";
  align: "start";
};

type SelectExamplePlacement = "bottom" | "right";

function clamp(value: number, min: number, max: number) {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

function requestSelectExampleFrame(defaultView: Window, callback: () => void) {
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

export function computeSelectExamplePosition(
  reference: SelectExampleRect,
  floating: Pick<SelectExampleRect, "width" | "height">,
  viewport: SelectExampleViewport,
  placement: SelectExamplePlacement = "bottom",
): SelectExamplePosition {
  if (placement === "right") {
    const rightSpace = viewport.width - reference.right - selectExamplePadding;
    const leftSpace = reference.left - selectExamplePadding;
    const side = reference.right + selectExampleOffset + floating.width > viewport.width - selectExamplePadding
      && leftSpace >= rightSpace
      ? "left"
      : "right";
    const left = side === "right"
      ? reference.right + selectExampleOffset
      : reference.left - selectExampleOffset - floating.width;

    return {
      top: clamp(reference.top, selectExamplePadding, viewport.height - floating.height - selectExamplePadding),
      left: clamp(left, selectExamplePadding, viewport.width - floating.width - selectExamplePadding),
      side,
      align: "start",
    };
  }

  const belowSpace = viewport.height - reference.bottom - selectExamplePadding;
  const aboveSpace = reference.top - selectExamplePadding;
  const side = reference.bottom + selectExampleOffset + floating.height > viewport.height - selectExamplePadding
    && aboveSpace >= belowSpace
    ? "top"
    : "bottom";
  const top = side === "bottom"
    ? reference.bottom + selectExampleOffset
    : reference.top - selectExampleOffset - floating.height;

  return {
    top: clamp(top, selectExamplePadding, viewport.height - floating.height - selectExamplePadding),
    left: clamp(reference.left, selectExamplePadding, viewport.width - floating.width - selectExamplePadding),
    side,
    align: "start",
  };
}

function setSelectExamplePosition(element: HTMLElement, position: SelectExamplePosition) {
  Object.assign(element.style, computePrePositionStyle(true, "while-hidden"));
  element.dataset.side = position.side;
  element.dataset.align = position.align;
  element.style.position = "fixed";
  element.style.top = position.top + "px";
  element.style.left = position.left + "px";
}

function clearSelectExamplePosition(element: HTMLElement) {
  Object.assign(element.style, computePrePositionStyle(false, "while-hidden"));
  delete element.dataset.side;
  delete element.dataset.align;
}

function selectExampleRoots(doc: Document) {
  return Array.from(doc.querySelectorAll<HTMLElement>([
    '.ariaui-web-preview[data-component="select"] aria-select',
    '.ariaui-web-preview[data-component="sidebar"] aria-select',
  ].join(", ")));
}

export function syncSelectExampleScrollLock(doc: Document = document) {
  const hasOpenSelect = Boolean(doc.querySelector(selectExampleOpenRootSelector));
  const documentElement = doc.documentElement;
  const body = doc.body;

  if (!body) {
    return;
  }

  if (hasOpenSelect && !selectExampleScrollStates.has(doc)) {
    selectExampleScrollStates.set(doc, {
      bodyOverflow: body.style.overflow,
      documentOverflow: documentElement.style.overflow,
    });
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    documentElement.dataset.ariauiWebSelectScrollLocked = "true";
    return;
  }

  if (!hasOpenSelect && selectExampleScrollStates.has(doc)) {
    const previous = selectExampleScrollStates.get(doc);
    selectExampleScrollStates.delete(doc);
    body.style.overflow = previous?.bodyOverflow ?? "";
    documentElement.style.overflow = previous?.documentOverflow ?? "";
    delete documentElement.dataset.ariauiWebSelectScrollLocked;
  }
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

function isSelectScrollAreaViewportScroll(event: Event | undefined) {
  return event?.type === "scroll"
    && event.target instanceof Element
    && event.target.classList.contains("ariaui-web-select-scroll-viewport");
}

function selectScrollAreaContent(root: HTMLElement) {
  return selectScrollAreaViewport(root)?.closest<HTMLElement>("aria-select-content") ?? null;
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

function setSelectScrollAreaKeyboardActiveOption(root: HTMLElement, activeOption: HTMLElement) {
  const content = selectScrollAreaContent(root);
  const activeValue = selectOptionValue(activeOption).replace(/[^a-zA-Z0-9_-]+/g, "-") || String(selectScrollAreaOptionId);

  if (!activeOption.id) {
    selectScrollAreaOptionId += 1;
    activeOption.id = `ariaui-web-select-scroll-option-${activeValue}-${selectScrollAreaOptionId}`;
  }

  if (content) {
    content.setAttribute("aria-activedescendant", activeOption.id);
  }

  for (const option of selectScrollAreaOptions(root)) {
    const active = option === activeOption;
    option.setAttribute("data-active", String(active));
    option.setAttribute("tabindex", active ? "0" : "-1");
  }

  activeOption.focus({ preventScroll: true });
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

function activateSelectScrollAreaOption(root: HTMLElement, option: HTMLElement, behavior: ScrollBehavior = "smooth") {
  selectScrollAreaOption(root, option);
  centerSelectScrollAreaOption(root, option, behavior);
  setSelectScrollAreaKeyboardActiveOption(root, option);
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
  requestSelectExampleFrame(defaultView, () => {
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
  requestSelectExampleFrame(defaultView, () => {
    pendingSelectScrollAreaScrollRoots.delete(root);
    syncSelectScrollAreaFromViewport(root);
  });
}

function activeSelectScrollAreaOption(root: HTMLElement) {
  const viewport = selectScrollAreaViewport(root);
  const options = selectScrollAreaOptions(root);
  const content = selectScrollAreaContent(root);
  const activeDescendant = content?.getAttribute("aria-activedescendant");

  return options.find((candidate) => candidate.getAttribute("data-scroll-active") === "true")
    ?? selectedSelectOptions(root).find((candidate) => viewport?.contains(candidate))
    ?? options.find((candidate) => activeDescendant && candidate.id === activeDescendant)
    ?? options[0]
    ?? null;
}

function handleSelectScrollAreaKeyDown(root: HTMLElement, event: KeyboardEvent) {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
    return;
  }

  const content = selectScrollAreaContent(root);
  const target = event.target;
  const trigger = root.querySelector<HTMLElement>(":scope > aria-select-trigger");

  if (
    !root.hasAttribute("open")
    || !content
    || content.hidden
    || !(target instanceof Node)
    || (!content.contains(target) && !trigger?.contains(target))
  ) {
    return;
  }

  const options = selectScrollAreaOptions(root);
  const activeOption = activeSelectScrollAreaOption(root);

  if (!activeOption || options.length === 0) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const direction = event.key === "ArrowUp" ? -1 : 1;
  const activeIndex = options.indexOf(activeOption);
  const nextIndex = Math.min(Math.max(activeIndex + direction, 0), options.length - 1);
  activateSelectScrollAreaOption(root, options[nextIndex] ?? activeOption);
}

function installSelectScrollAreaExample(root: HTMLElement) {
  const viewport = selectScrollAreaViewport(root);

  if (!viewport || installedSelectScrollAreaRoots.has(root)) {
    return;
  }

  installedSelectScrollAreaRoots.add(root);

  root.addEventListener("keydown", (event) => handleSelectScrollAreaKeyDown(root, event), true);

  root.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const option = event.target.closest<HTMLElement>(".ariaui-web-select-scroll-option");
    if (option?.closest("aria-select") === root) {
      event.preventDefault();
      activateSelectScrollAreaOption(root, option);
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

    activateSelectScrollAreaOption(root, nextOption);
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

function positionSelectExampleContent(root: HTMLElement) {
  const ownerDocument = root.ownerDocument;
  const defaultView = ownerDocument.defaultView;
  const trigger = root.querySelector<HTMLElement>(":scope > aria-select-trigger");
  const content = root.querySelector<HTMLElement>(":scope > aria-select-content");

  if (!defaultView || !trigger || !content) {
    return;
  }

  if (content.hidden || !root.hasAttribute("open")) {
    clearSelectExamplePosition(content);
    return;
  }

  setSelectExamplePosition(content, computeSelectExamplePosition(
    trigger.getBoundingClientRect(),
    content.getBoundingClientRect(),
    {
      width: defaultView.innerWidth,
      height: defaultView.innerHeight,
    },
  ));
}

function positionSelectExampleSubContent(sub: HTMLElement) {
  const ownerDocument = sub.ownerDocument;
  const defaultView = ownerDocument.defaultView;
  const trigger = sub.querySelector<HTMLElement>(":scope > aria-select-sub-trigger");
  const content = sub.querySelector<HTMLElement>(":scope > aria-select-sub-content");

  if (!defaultView || !trigger || !content) {
    return;
  }

  if (content.hidden || !sub.hasAttribute("open")) {
    clearSelectExamplePosition(content);
    return;
  }

  setSelectExamplePosition(content, computeSelectExamplePosition(
    trigger.getBoundingClientRect(),
    content.getBoundingClientRect(),
    {
      width: defaultView.innerWidth,
      height: defaultView.innerHeight,
    },
    "right",
  ));
}

function selectChipsRemovable(root: HTMLElement) {
  return root.getAttribute("data-select-chip-remove") !== "false";
}

function selectChipLabel(ownerDocument: Document, label: string, value: string, removable = true) {
  const chip = ownerDocument.createElement("span");
  chip.className = "ariaui-web-select-chip";
  if (value) {
    chip.setAttribute("data-select-chip-value", value);
  }
  chip.textContent = label;

  if (!removable) {
    return chip;
  }

  const remove = ownerDocument.createElement("span");
  remove.className = "ariaui-web-select-remove";
  remove.setAttribute("aria-hidden", "true");
  remove.textContent = "×";
  chip.append(remove);

  return chip;
}

function selectOverflowCountLabel(count: number) {
  return `${count} more selected`;
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
  const chipsRemovable = selectChipsRemovable(root);
  const tagGroup = selectionGroup.querySelector<HTMLElement>(".ariaui-web-select-tag-group") ?? selectionGroup;
  const input = selectionGroup.querySelector<HTMLElement>(".ariaui-web-select-combobox-input");
  const currentLabels = Array.from(tagGroup.querySelectorAll<HTMLElement>(".ariaui-web-select-chip"))
    .map((chip) => (chip.textContent ?? "").replace(/[×]/g, "").trim());
  const currentValues = Array.from(tagGroup.querySelectorAll<HTMLElement>(".ariaui-web-select-chip"))
    .map((chip) => chip.getAttribute("data-select-chip-value") ?? "");
  const visibleLabels = visibleOptions.map(selectOptionLabel);
  const visibleValues = visibleOptions.map(selectOptionValue);
  const currentOverflow = selectionGroup.querySelector<HTMLElement>(".ariaui-web-select-overflow-count")?.textContent ?? "";
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
    const chip = selectChipLabel(root.ownerDocument, selectOptionLabel(option), selectOptionValue(option), chipsRemovable);
    if (input && tagGroup === selectionGroup) {
      selectionGroup.insertBefore(chip, input);
    } else {
      tagGroup.append(chip);
    }
  }

  let overflowCountElement = selectionGroup.querySelector<HTMLElement>(".ariaui-web-select-overflow-count");
  if (overflowCount > 0) {
    if (!overflowCountElement) {
      overflowCountElement = root.ownerDocument.createElement("span");
      overflowCountElement.className = "ariaui-web-select-overflow-count";
      selectionGroup.insertBefore(overflowCountElement, input ?? null);
    }
    overflowCountElement.textContent = `+${overflowCount}`;
    overflowCountElement.setAttribute("aria-label", selectOverflowCountLabel(overflowCount));
  } else {
    overflowCountElement?.remove();
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
    positionSelectExampleContent(root);

    for (const sub of Array.from(root.querySelectorAll<HTMLElement>("aria-select-sub"))) {
      positionSelectExampleSubContent(sub);
    }
  }

  syncSelectExampleScrollLock(doc);
}

function queueSelectExampleSync(doc: Document) {
  const defaultView = doc.defaultView;

  if (!defaultView || pendingSelectExampleDocuments.has(doc)) {
    return;
  }

  pendingSelectExampleDocuments.add(doc);
  requestSelectExampleFrame(defaultView, () => {
    pendingSelectExampleDocuments.delete(doc);
    syncSelectExamples(doc);
  });
}

export function installSelectExamples(doc: Document = document) {
  if (installedSelectExampleDocuments.has(doc)) {
    return;
  }

  installedSelectExampleDocuments.add(doc);
  const scheduleSync = (event?: Event) => {
    if (isSelectScrollAreaViewportScroll(event)) {
      return;
    }

    queueSelectExampleSync(doc);
  };

  doc.addEventListener("valuechange", scheduleSync);
  doc.addEventListener("keydown", scheduleSync, true);
  doc.addEventListener("mouseover", scheduleSync, true);
  doc.addEventListener("pointerdown", scheduleSync, true);
  doc.addEventListener("click", scheduleSync, true);
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

function removeSelectChipValue(chip: HTMLElement) {
  const value = chip.getAttribute("data-select-chip-value");
  const root = chip.closest<HTMLElement>("aria-select");

  if (!value || !root || !root.closest('.ariaui-web-preview[data-component="select"]')) {
    return;
  }

  writeSelectValues(root, selectValues(root).filter((candidate) => candidate !== value));
  syncMultipleSelectExample(root);
}
