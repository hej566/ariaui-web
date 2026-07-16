import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import {
  autoUpdate,
  computePosition,
} from "@ariaui-web/position";
import {
  createApplyInputMask,
  defaultFormatInput,
  defaultParseInput,
  formatDatePart,
  parseDatepickerValue,
  parseIsoDate,
  resolveVisibleMonthFromValue,
  serializeDatepickerValue,
} from "./datepicker-input";
import type { DatepickerInputMaskPreset, DatepickerMode, DatepickerValue } from "./types";

type DatepickerRootElement = DatepickerWebElement & {
  syncDatepickerTreeFromRoot: () => void;
};

type DatepickerSyncState = {
  cleanupDismissal: (() => void) | null;
  cleanupPosition: (() => void) | null;
  defaultOpenApplied: boolean;
  defaultValueApplied: boolean;
  defaultVisibleMonthApplied: boolean;
  inputDirty: boolean;
  observer: MutationObserver | null;
  positionHost: HTMLElement | null;
  positionReference: HTMLElement | null;
  previousOpen: boolean | null;
  syncing: boolean;
};

type DatepickerInputEditMetadata = {
  data: string | null | undefined;
  inputType: string | undefined;
  selectionEnd: number | null;
  selectionStart: number | null;
};

const states = new WeakMap<HTMLElement, DatepickerSyncState>();
const inputControls = new WeakSet<HTMLInputElement>();
const inputEditMetadata = new WeakMap<HTMLInputElement, DatepickerInputEditMetadata>();
const rootListeners = new WeakSet<HTMLElement>();
let datepickerId = 0;
const datepickerContentOffset = 8;
const datepickerContentPlacement = "bottom-start";

const datepickerCalendarAliasTags = new Map([
  ["aria-datepicker-calendar-header", "aria-calendar-header"],
  ["aria-datepicker-calendar-previous", "aria-calendar-header-previous"],
  ["aria-datepicker-calendar-month", "aria-calendar-header-month"],
  ["aria-datepicker-calendar-month-select", "aria-calendar-month-select"],
  ["aria-datepicker-calendar-year", "aria-calendar-header-year"],
  ["aria-datepicker-calendar-year-select", "aria-calendar-year-select"],
  ["aria-datepicker-calendar-next", "aria-calendar-header-next"],
  ["aria-datepicker-calendar-body", "aria-calendar-body"],
]);

function stateFor(root: HTMLElement): DatepickerSyncState {
  const existing = states.get(root);
  if (existing) {
    return existing;
  }

  const state: DatepickerSyncState = {
    cleanupDismissal: null,
    cleanupPosition: null,
    defaultOpenApplied: false,
    defaultValueApplied: false,
    defaultVisibleMonthApplied: false,
    inputDirty: false,
    observer: null,
    positionHost: null,
    positionReference: null,
    previousOpen: null,
    syncing: false,
  };
  states.set(root, state);
  return state;
}

function partName(element: HTMLElement) {
  return (element.constructor as typeof DatepickerWebElement).partName;
}

function datepickerRoot(element: Element | null) {
  return element?.closest("aria-datepicker") as DatepickerRootElement | null;
}

function datepickerElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => datepickerRoot(element) === root,
  );
}

function firstDatepickerElement(root: Element, selector: string) {
  return datepickerElements(root, selector)[0] ?? null;
}

function setAttributeValue(element: Element, attribute: string, value: string) {
  if (element.getAttribute(attribute) !== value) {
    element.setAttribute(attribute, value);
  }
}

function removeAttributeValue(element: Element, attribute: string) {
  if (element.hasAttribute(attribute)) {
    element.removeAttribute(attribute);
  }
}

function ensureId(element: HTMLElement, part: string) {
  if (!element.id) {
    element.id = `ariaui-datepicker-${part}-${++datepickerId}`;
  }

  return element.id;
}

function datepickerMode(root: Element): DatepickerMode {
  const mode = root.getAttribute("mode");
  return mode === "range" || mode === "dual-range" ? mode : "single";
}

function inputMask(root: Element) {
  const mask = root.getAttribute("input-mask");
  return mask === "mdy" || mask === "iso" || mask === "custom" ? mask : undefined;
}

function maskDelimiter(root: Element) {
  return root.getAttribute("mask-delimiter") ?? " - ";
}

function rootValue(root: Element): DatepickerValue {
  return parseDatepickerValue(root.getAttribute("value"), datepickerMode(root));
}

function rootValueText(root: Element) {
  return defaultFormatInput(rootValue(root), datepickerMode(root), inputMask(root), maskDelimiter(root));
}

function rootHasValue(root: Element, input?: HTMLInputElement | null) {
  return Boolean(root.getAttribute("value")?.trim() || input?.value.trim());
}

function rootVisibleMonth(root: Element) {
  return parseIsoDate(root.getAttribute("visible-month") ?? "")
    ?? resolveVisibleMonthFromValue(rootValue(root))
    ?? new Date();
}

function applyDatepickerDefaults(root: HTMLElement, state: DatepickerSyncState) {
  if (!state.defaultOpenApplied && (root.hasAttribute("default-open") || root.hasAttribute("open"))) {
    state.defaultOpenApplied = true;
    if (root.hasAttribute("default-open") && !root.hasAttribute("open")) {
      root.setAttribute("open", "");
    }
  }

  if (
    !state.defaultValueApplied
    && (
      root.hasAttribute("value")
      || root.hasAttribute("default-value")
      || root.hasAttribute("defaultvalue")
    )
  ) {
    state.defaultValueApplied = true;
    if (!root.hasAttribute("value")) {
      const defaultValue = root.getAttribute("default-value") ?? root.getAttribute("defaultvalue");
      if (defaultValue) {
        root.setAttribute("value", defaultValue);
      }
    }
  }

  if (
    !state.defaultVisibleMonthApplied
    && (
      root.hasAttribute("visible-month")
      || root.hasAttribute("default-visible-month")
      || root.hasAttribute("value")
    )
  ) {
    state.defaultVisibleMonthApplied = true;
    if (!root.hasAttribute("visible-month")) {
      const defaultVisibleMonth = root.getAttribute("default-visible-month");
      const visibleMonth = parseIsoDate(defaultVisibleMonth ?? "") ?? resolveVisibleMonthFromValue(rootValue(root));
      if (visibleMonth) {
        root.setAttribute("visible-month", formatDatePart(visibleMonth));
      }
    }
  }
}

function dispatchRootEvent(root: HTMLElement, type: string, detail: Record<string, unknown>) {
  root.dispatchEvent(new CustomEvent(type, {
    bubbles: true,
    detail,
  }));
}

function setRootOpen(root: DatepickerRootElement, open: boolean) {
  const previous = root.hasAttribute("open");
  root.toggleAttribute("open", open);
  if (previous !== open) {
    dispatchRootEvent(root, "openchange", { open });
  } else {
    syncDatepickerTreeFromRoot(root);
  }
}

function setRootValue(root: DatepickerRootElement, value: DatepickerValue) {
  const serialized = serializeDatepickerValue(value);
  const previous = root.getAttribute("value") ?? "";

  if (serialized) {
    root.setAttribute("value", serialized);
  } else {
    root.removeAttribute("value");
  }

  if (previous !== serialized) {
    dispatchRootEvent(root, "valuechange", {
      value,
      values: serialized ? serialized.split(",") : [],
    });
  }
}

function setRootVisibleMonth(root: DatepickerRootElement, visibleMonth: Date) {
  const serialized = formatDatePart(visibleMonth);
  const previous = root.getAttribute("visible-month");
  root.setAttribute("visible-month", serialized);

  if (previous !== serialized) {
    dispatchRootEvent(root, "visiblemonthchange", {
      value: visibleMonth,
      visibleMonth,
    });
  }
}

function ensureInputControl(host: HTMLElement) {
  const existing = Array.from(host.children).find(
    (child): child is HTMLInputElement => child instanceof HTMLInputElement,
  );
  if (existing) {
    existing.dataset.datepickerInputControl = "true";
    return existing;
  }

  const input = document.createElement("input");
  input.type = host.getAttribute("type") || "text";
  input.dataset.datepickerInputControl = "true";
  input.setAttribute("part", "input-control");
  host.append(input);
  return input;
}

function copyInputAttribute(host: HTMLElement, input: HTMLInputElement, name: string) {
  const value = host.getAttribute(name);
  if (value == null) {
    input.removeAttribute(name);
  } else {
    input.setAttribute(name, value);
  }
}

function restoreInputSelection(input: HTMLInputElement, selectionStart?: number | null, selectionEnd?: number | null) {
  if (selectionStart == null || selectionEnd == null || typeof input.setSelectionRange !== "function") {
    return;
  }

  try {
    input.setSelectionRange(selectionStart, selectionEnd);
  } catch {
    // Some input types intentionally do not support selection ranges.
  }
}

function keydownEditMetadata(event: KeyboardEvent) {
  if (event.key === "Backspace") {
    return { data: null, inputType: "deleteContentBackward" };
  }

  if (event.key === "Delete") {
    return { data: null, inputType: "deleteContentForward" };
  }

  if (/^\d$/.test(event.key)) {
    return { data: event.key, inputType: "insertText" };
  }

  return undefined;
}

function commitInputText(root: DatepickerRootElement, input: HTMLInputElement) {
  const mode = datepickerMode(root);
  const state = stateFor(root);

  if (root.hasAttribute("read-only") || root.hasAttribute("readonly")) {
    return;
  }

  const trimmedText = input.value.trim();
  if (!trimmedText) {
    state.inputDirty = false;
    setRootValue(root, undefined);
    input.value = "";
    syncDatepickerTreeFromRoot(root);
    return;
  }

  const parsedValue = defaultParseInput(trimmedText, mode, maskDelimiter(root));
  if (!parsedValue) {
    state.inputDirty = true;
    syncDatepickerTreeFromRoot(root);
    return;
  }

  state.inputDirty = false;
  setRootValue(root, parsedValue);
  const nextVisibleMonth = resolveVisibleMonthFromValue(parsedValue);
  if (nextVisibleMonth) {
    setRootVisibleMonth(root, nextVisibleMonth);
  }
  input.value = defaultFormatInput(parsedValue, mode, inputMask(root), maskDelimiter(root));
  syncDatepickerTreeFromRoot(root);
}

function bindInputControl(root: DatepickerRootElement, host: HTMLElement, input: HTMLInputElement) {
  if (inputControls.has(input)) {
    return;
  }

  input.addEventListener("beforeinput", (event) => {
    const activeRoot = datepickerRoot(host);
    const mask = activeRoot ? inputMask(activeRoot) : undefined;
    if (
      !activeRoot
      || (mask !== "mdy" && mask !== "iso")
      || activeRoot.hasAttribute("disabled")
      || activeRoot.hasAttribute("read-only")
      || activeRoot.hasAttribute("readonly")
    ) {
      inputEditMetadata.delete(input);
      return;
    }

    const inputEvent = event instanceof InputEvent ? event : null;
    inputEditMetadata.set(input, {
      data: inputEvent?.data ?? null,
      inputType: inputEvent?.inputType,
      selectionEnd: input.selectionEnd,
      selectionStart: input.selectionStart,
    });
  });

  input.addEventListener("input", (event) => {
    const activeRoot = datepickerRoot(host);
    if (!activeRoot) {
      return;
    }

    const state = stateFor(activeRoot);
    const previousText = input.dataset.datepickerPreviousText ?? "";
    const inputEvent = event instanceof InputEvent ? event : null;
    const mask = inputMask(activeRoot);
    const editMetadata = mask === "mdy" || mask === "iso"
      ? inputEditMetadata.get(input)
      : undefined;
    inputEditMetadata.delete(input);
    const maskConfig: {
      mode: DatepickerMode;
      inputMask?: DatepickerInputMaskPreset;
      maskDelimiter: string;
    } = {
      mode: datepickerMode(activeRoot),
      maskDelimiter: maskDelimiter(activeRoot),
    };
    if (mask) {
      maskConfig.inputMask = mask;
    }

    const maskArgs: {
      text: string;
      previousText: string;
      selectionStart: number | null;
      selectionEnd: number | null;
      inputType?: string;
      data?: string | null;
    } = {
      text: input.value,
      previousText,
      selectionStart: editMetadata?.selectionStart ?? input.selectionStart,
      selectionEnd: editMetadata?.selectionEnd ?? input.selectionEnd,
    };
    const inputType = editMetadata?.inputType ?? inputEvent?.inputType;
    const data = editMetadata?.data ?? inputEvent?.data;
    if (inputType !== undefined) {
      maskArgs.inputType = inputType;
    }
    if (data !== undefined) {
      maskArgs.data = data;
    }

    const masked = createApplyInputMask(maskConfig)(maskArgs);

    input.value = masked.text;
    input.dataset.datepickerPreviousText = masked.text;
    state.inputDirty = true;
    restoreInputSelection(input, masked.selectionStart, masked.selectionEnd);
    syncDatepickerTreeFromRoot(activeRoot);
  });

  input.addEventListener("keydown", (event) => {
    const activeRoot = datepickerRoot(host);
    if (!activeRoot || event.defaultPrevented) {
      return;
    }

    const mask = inputMask(activeRoot);
    if (
      (mask === "mdy" || mask === "iso")
      && !activeRoot.hasAttribute("disabled")
      && !activeRoot.hasAttribute("read-only")
      && !activeRoot.hasAttribute("readonly")
      && !inputEditMetadata.has(input)
    ) {
      const editMetadata = keydownEditMetadata(event);
      if (editMetadata) {
        inputEditMetadata.set(input, {
          ...editMetadata,
          selectionEnd: input.selectionEnd,
          selectionStart: input.selectionStart,
        });
      }
    }

    if (event.key === "Enter") {
      event.preventDefault();
      commitInputText(activeRoot, input);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setRootOpen(activeRoot, true);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setRootOpen(activeRoot, false);
    }
  });

  input.addEventListener("blur", () => {
    const activeRoot = datepickerRoot(host);
    if (activeRoot) {
      commitInputText(activeRoot, input);
    }
  });

  inputControls.add(input);
}

function syncInput(root: DatepickerRootElement, state: DatepickerSyncState) {
  const host = firstDatepickerElement(root, "aria-datepicker-input");
  if (!host) {
    return null;
  }

  const input = ensureInputControl(host);
  bindInputControl(root, host, input);

  for (const attribute of ["aria-label", "aria-labelledby", "autocomplete", "name", "placeholder", "required", "type"]) {
    copyInputAttribute(host, input, attribute);
  }

  input.disabled = root.hasAttribute("disabled") || host.hasAttribute("disabled");
  input.readOnly = root.hasAttribute("read-only") || root.hasAttribute("readonly") || host.hasAttribute("readonly");
  setAttributeValue(host, "aria-haspopup", "dialog");
  setAttributeValue(input, "aria-haspopup", "dialog");

  const shouldPreserveInput = state.inputDirty;
  if (!shouldPreserveInput) {
    input.value = rootValueText(root);
    input.dataset.datepickerPreviousText = input.value;
    state.inputDirty = false;
  }

  return input;
}

function contentHost(content: HTMLElement) {
  if (!content.hasAttribute("native-composition")) {
    return content;
  }

  return Array.from(content.children).find(
    (child): child is HTMLElement => child instanceof HTMLElement,
  ) ?? content;
}

function syncTrigger(root: DatepickerRootElement, input: HTMLInputElement | null) {
  const trigger = firstDatepickerElement(root, "aria-datepicker-trigger");
  if (!trigger) {
    return null;
  }

  const open = root.hasAttribute("open");
  setAttributeValue(trigger, "aria-haspopup", "dialog");
  setAttributeValue(trigger, "aria-expanded", String(open));
  setAttributeValue(trigger, "data-state", open ? "open" : "closed");
  setAttributeValue(trigger, "data-has-value", String(rootHasValue(root, input)));
  return trigger;
}

function datepickerPositionReference(
  root: DatepickerRootElement,
  trigger: HTMLElement | null,
  input: HTMLInputElement | null,
) {
  const inputHost = input?.closest("aria-datepicker-input");
  const triggerParent = trigger?.parentElement;

  if (
    inputHost
    && triggerParent instanceof HTMLElement
    && datepickerRoot(triggerParent) === root
    && triggerParent.contains(inputHost)
  ) {
    return triggerParent;
  }

  return trigger ?? input;
}

function clearDatepickerContentPosition(host: HTMLElement) {
  delete host.dataset.side;
  delete host.dataset.align;
  host.style.removeProperty("bottom");
  host.style.removeProperty("left");
  host.style.removeProperty("margin");
  host.style.removeProperty("position");
  host.style.removeProperty("right");
  host.style.removeProperty("top");
  host.style.removeProperty("visibility");
}

function stopDatepickerContentPosition(state: DatepickerSyncState, clear = false) {
  state.cleanupPosition?.();
  state.cleanupPosition = null;

  if (clear && state.positionHost) {
    clearDatepickerContentPosition(state.positionHost);
  }

  state.positionHost = null;
  state.positionReference = null;
}

function updateDatepickerContentPosition(reference: HTMLElement, host: HTMLElement) {
  const result = computePosition(reference, host, {
    boundary: "viewport",
    offset: datepickerContentOffset,
    placement: datepickerContentPlacement,
    strategy: "fixed",
  });
  const [side = "bottom", align = "center"] = result.placement.split("-");
  const left = `${result.x}px`;
  const top = `${result.y}px`;

  if (host.style.position !== result.strategy) host.style.position = result.strategy;
  if (host.style.margin !== "0px") host.style.margin = "0";
  if (host.style.right !== "auto") host.style.right = "auto";
  if (host.style.bottom !== "auto") host.style.bottom = "auto";
  if (host.style.left !== left) host.style.left = left;
  if (host.style.top !== top) host.style.top = top;
  if (host.style.visibility !== "visible") host.style.visibility = "visible";
  if (host.style.zIndex !== "9999") host.style.zIndex = "9999";
  if (host.dataset.side !== side) host.dataset.side = side;
  if (host.dataset.align !== align) host.dataset.align = align;
}

function syncDatepickerContentPosition(
  state: DatepickerSyncState,
  reference: HTMLElement | null,
  host: HTMLElement,
  open: boolean,
) {
  if (!open || !reference) {
    stopDatepickerContentPosition(state, true);
    return;
  }

  if (state.positionReference === reference && state.positionHost === host && state.cleanupPosition) {
    updateDatepickerContentPosition(reference, host);
    return;
  }

  stopDatepickerContentPosition(state, true);
  host.style.position = "fixed";
  host.style.left = "0px";
  host.style.top = "0px";
  host.style.visibility = "hidden";
  host.style.zIndex = "9999";

  const update = () => updateDatepickerContentPosition(reference, host);
  update();

  state.positionReference = reference;
  state.positionHost = host;
  state.cleanupPosition = autoUpdate(reference, host, update, () => {
    if (state.positionHost === host && host.style.visibility !== "hidden") {
      host.style.visibility = "hidden";
    }
  }) ?? null;
}

function mapDatepickerCalendarAlias(node: Node): Node {
  if (!(node instanceof HTMLElement)) {
    return node;
  }

  const replacementTag = datepickerCalendarAliasTags.get(node.tagName.toLowerCase());
  if (!replacementTag) {
    return node;
  }

  const replacement = node.ownerDocument.createElement(replacementTag);
  for (const attribute of Array.from(node.attributes)) {
    replacement.setAttribute(attribute.name, attribute.value);
  }
  while (node.firstChild) {
    replacement.append(mapDatepickerCalendarAlias(node.firstChild));
  }
  return replacement;
}

function ensureCalendarRoot(calendarHost: HTMLElement) {
  const existing = Array.from(calendarHost.children).find(
    (child): child is HTMLElement => child instanceof HTMLElement && child.matches("aria-calendar"),
  );
  if (existing) {
    existing.dataset.datepickerCalendarRoot = "true";
    return existing;
  }

  const calendar = calendarHost.ownerDocument.createElement("aria-calendar");
  calendar.dataset.datepickerCalendarRoot = "true";
  while (calendarHost.firstChild) {
    calendar.append(mapDatepickerCalendarAlias(calendarHost.firstChild));
  }

  if (!calendar.querySelector("aria-calendar-body")) {
    calendar.append(calendarHost.ownerDocument.createElement("aria-calendar-body"));
  }

  calendarHost.append(calendar);
  return calendar;
}

function syncCalendar(root: DatepickerRootElement) {
  const calendarHost = firstDatepickerElement(root, "aria-datepicker-calendar");
  if (!calendarHost) {
    return null;
  }

  const calendar = ensureCalendarRoot(calendarHost);
  setAttributeValue(calendar, "mode", datepickerMode(root));
  const value = root.getAttribute("value") ?? "";
  if (value) {
    setAttributeValue(calendar, "value", value);
  } else {
    removeAttributeValue(calendar, "value");
  }

  const visibleMonth = root.getAttribute("visible-month") || formatDatePart(rootVisibleMonth(root));
  setAttributeValue(calendar, "visible-month", visibleMonth);
  return calendar;
}

function syncContent(
  root: DatepickerRootElement,
  state: DatepickerSyncState,
  trigger: HTMLElement | null,
  input: HTMLInputElement | null,
) {
  const content = firstDatepickerElement(root, "aria-datepicker-content");
  if (!content) {
    stopDatepickerContentPosition(state, true);
    return null;
  }

  const open = root.hasAttribute("open");
  const host = contentHost(content);
  const label = firstDatepickerElement(root, "aria-datepicker-label");

  ensureId(host, "content");
  if (label) {
    setAttributeValue(host, "aria-labelledby", ensureId(label, "label"));
  } else {
    removeAttributeValue(host, "aria-labelledby");
  }

  setAttributeValue(host, "role", "dialog");
  setAttributeValue(host, "aria-modal", "true");
  setAttributeValue(host, "data-state", open ? "open" : "closed");
  host.hidden = !open;

  if (trigger && open) {
    setAttributeValue(trigger, "aria-controls", host.id);
  } else if (trigger) {
    removeAttributeValue(trigger, "aria-controls");
  }

  syncDatepickerContentPosition(
    state,
    datepickerPositionReference(root, trigger, input),
    host,
    open,
  );

  return host;
}

function focusFirstCalendarCell(content: HTMLElement) {
  const focusTarget = content.querySelector<HTMLElement>(
    "aria-calendar-cell[tabindex='0'], [role='gridcell'][tabindex='0'], button, input, [tabindex]:not([tabindex='-1'])",
  );
  focusTarget?.focus();
}

function installDismissal(root: DatepickerRootElement, state: DatepickerSyncState) {
  if (state.cleanupDismissal) {
    return;
  }

  const ownerDocument = root.ownerDocument;
  const handlePointerDown = (event: Event) => {
    const target = event.target instanceof Node ? event.target : null;
    if (!target || root.contains(target)) {
      return;
    }

    setRootOpen(root, false);
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setRootOpen(root, false);
    }
  };

  ownerDocument.addEventListener("pointerdown", handlePointerDown, true);
  ownerDocument.addEventListener("keydown", handleKeyDown, true);
  state.cleanupDismissal = () => {
    ownerDocument.removeEventListener("pointerdown", handlePointerDown, true);
    ownerDocument.removeEventListener("keydown", handleKeyDown, true);
    state.cleanupDismissal = null;
  };
}

function removeDismissal(state: DatepickerSyncState) {
  state.cleanupDismissal?.();
}

function handleCalendarValueChange(root: DatepickerRootElement, event: Event) {
  if (event.target === root || !(event.target instanceof Element)) {
    return;
  }

  const calendar = event.target.closest("aria-calendar");
  if (!calendar || !root.contains(calendar)) {
    return;
  }

  const mode = datepickerMode(root);
  const dates = (event as CustomEvent<{ dates?: Date[] }>).detail?.dates
    ?? (calendar.getAttribute("value") ?? "")
      .split(",")
      .map((entry) => parseIsoDate(entry.trim()))
      .filter((date): date is Date => Boolean(date));
  const nextValue: DatepickerValue = mode === "single"
    ? dates[0]
    : (() => {
      const rangeValue: Exclude<DatepickerValue, Date | undefined> = {};
      if (dates[0]) {
        rangeValue.start = dates[0];
      }
      if (dates[1]) {
        rangeValue.end = dates[1];
      }
      return rangeValue.start || rangeValue.end ? rangeValue : undefined;
    })();

  stateFor(root).inputDirty = false;
  setRootValue(root, nextValue);
  const visibleMonth = resolveVisibleMonthFromValue(nextValue);
  if (visibleMonth) {
    setRootVisibleMonth(root, visibleMonth);
  }

  if (mode === "single" || dates.length >= 2) {
    setRootOpen(root, false);
  } else {
    syncDatepickerTreeFromRoot(root);
  }
}

function handleCalendarVisibleMonthChange(root: DatepickerRootElement, event: Event) {
  if (event.target === root || !(event.target instanceof Element)) {
    return;
  }

  const calendar = event.target.closest("aria-calendar");
  if (!calendar || !root.contains(calendar)) {
    return;
  }

  const value = (event as CustomEvent<{ visibleMonth?: Date; value?: Date }>).detail?.visibleMonth
    ?? (event as CustomEvent<{ visibleMonth?: Date; value?: Date }>).detail?.value
    ?? parseIsoDate(calendar.getAttribute("visible-month") ?? "");
  if (value) {
    setRootVisibleMonth(root, value);
  }
}

function bindRootListeners(root: DatepickerRootElement) {
  if (rootListeners.has(root)) {
    return;
  }

  root.addEventListener("valuechange", (event) => handleCalendarValueChange(root, event));
  root.addEventListener("visiblemonthchange", (event) => handleCalendarVisibleMonthChange(root, event));
  rootListeners.add(root);
}

function syncOpenFocus(root: DatepickerRootElement, state: DatepickerSyncState, input: HTMLInputElement | null, content: HTMLElement | null) {
  const open = root.hasAttribute("open");
  if (state.previousOpen == null) {
    state.previousOpen = open;
    return;
  }

  if (state.previousOpen === open) {
    return;
  }

  state.previousOpen = open;
  queueMicrotask(() => {
    if (open && content) {
      focusFirstCalendarCell(content);
    } else if (!open) {
      input?.focus();
    }
  });
}

export function syncDatepickerTreeFromRoot(root: DatepickerRootElement) {
  const state = stateFor(root);
  if (state.syncing) {
    return;
  }

  state.syncing = true;
  try {
    applyDatepickerDefaults(root, state);
    bindRootListeners(root);

    const input = syncInput(root, state);
    const trigger = syncTrigger(root, input);
    syncCalendar(root);
    const content = syncContent(root, state, trigger, input);

    root.setAttribute("data-state", root.hasAttribute("open") ? "open" : "closed");
    if (root.hasAttribute("open")) {
      installDismissal(root, state);
    } else {
      removeDismissal(state);
    }
    syncOpenFocus(root, state, input, content);
  } finally {
    state.syncing = false;
  }
}

function observeDatepickerRoot(root: DatepickerRootElement) {
  const state = stateFor(root);
  if (state.observer || typeof MutationObserver === "undefined") {
    return;
  }

  state.observer = new MutationObserver(() => syncDatepickerTreeFromRoot(root));
  state.observer.observe(root, {
    attributeFilter: [
      "default-open",
      "default-value",
      "default-visible-month",
      "disabled",
      "input-mask",
      "mask-delimiter",
      "mode",
      "open",
      "read-only",
      "readonly",
      "value",
      "visible-month",
    ],
    attributes: true,
    childList: true,
    subtree: true,
  });
}

function cleanupDatepickerRoot(root: HTMLElement) {
  const state = states.get(root);
  state?.observer?.disconnect();
  state?.cleanupDismissal?.();
  if (state) {
    stopDatepickerContentPosition(state, true);
  }
  states.delete(root);
}

export class DatepickerWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "aria-label",
      "autocomplete",
      "default-open",
      "default-value",
      "default-visible-month",
      "input-mask",
      "mask-delimiter",
      "placeholder",
      "read-only",
      "readonly",
      "visible-month",
    ]));
  }

  syncDatepickerTreeFromRoot = () => {
    const root = datepickerRoot(this);
    if (root) {
      syncDatepickerTreeFromRoot(root);
    }
  };

  override connectedCallback() {
    super.connectedCallback();

    if (partName(this) === "Root") {
      observeDatepickerRoot(this as DatepickerRootElement);
      syncDatepickerTreeFromRoot(this as DatepickerRootElement);
    } else {
      this.syncDatepickerTreeFromRoot();
    }
  }

  disconnectedCallback() {
    if (partName(this) === "Root") {
      cleanupDatepickerRoot(this);
    }
  }

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue !== newValue) {
      this.syncDatepickerTreeFromRoot();
    }
  }

  override afterAriaWebContractApplied() {
    this.syncDatepickerTreeFromRoot();
  }

  override focus(options?: FocusOptions) {
    if (partName(this) === "Input") {
      const input = this.querySelector("input");
      if (input instanceof HTMLInputElement) {
        input.focus(options);
        return;
      }
    }

    super.focus(options);
  }

  override handleAriaWebClick = (event: Event) => {
    if (event.defaultPrevented) {
      return;
    }

    if (this.hasAttribute("disabled")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    const currentPart = partName(this);
    if (this.hasAttribute("pressed")) {
      this.pressed = !this.pressed;
    }

    if (currentPart === "Input") {
      const input = this.querySelector("input");
      if (input instanceof HTMLInputElement && event.target === this) {
        input.focus();
      }
      return;
    }

    if (currentPart === "Trigger") {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("aria-datepicker-input, input")) {
        return;
      }

      const root = datepickerRoot(this);
      if (root) {
        setRootOpen(root, !root.hasAttribute("open"));
      }
      return;
    }

    if (this.getAttribute("role") === "button") {
      return;
    }
  };
}

export function createDatepickerWebComponent(part: WebComponentPartSpec): typeof DatepickerWebElement {
  return class extends DatepickerWebElement {
    static override packageSlug = "datepicker";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
