import {
  clearToasts,
  cloneToastTemplate,
  dismissToast,
  getToastSnapshot,
  registerToastLimit,
  retainToasts,
  subscribeToToasts,
  type ToastRecord,
} from "./toast-store";

type Timer = ReturnType<typeof setTimeout>;

type ItemState = {
  dismiss: (() => void) | null;
  duration: number;
  pausedByList: boolean;
  timeout: Timer | null;
};

type ListState = {
  bound: boolean;
  expanded: boolean;
  exitFade: Timer | null;
  exitId: string | null;
  exitRemove: Timer | null;
  exitStart: Timer | null;
  previousCount: number;
  registerLimit: (() => void) | null;
  syncing: boolean;
  trigger: HTMLElement | null;
  triggerCleanup: (() => void) | null;
  unsubscribe: (() => void) | null;
};

const itemStates = new WeakMap<HTMLElement, ItemState>();
const listStates = new WeakMap<HTMLElement, ListState>();
const boundItems = new WeakSet<HTMLElement>();
const boundCloses = new WeakSet<HTMLElement>();
let focusRestoreTarget: HTMLElement | null = null;

function partName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

function numberAttribute(element: HTMLElement, name: string, fallback: number, minimum = 0) {
  const attribute = element.getAttribute(name);
  const value = attribute == null ? fallback : Number(attribute);
  return Math.max(minimum, Number.isFinite(value) ? value : fallback);
}

function itemState(item: HTMLElement): ItemState {
  let state = itemStates.get(item);
  if (!state) {
    state = {
      dismiss: null,
      duration: numberAttribute(item, "duration", 3000),
      pausedByList: false,
      timeout: null,
    };
    itemStates.set(item, state);
  }
  return state;
}

function listState(list: HTMLElement): ListState {
  let state = listStates.get(list);
  if (!state) {
    state = {
      bound: false,
      expanded: false,
      exitFade: null,
      exitId: null,
      exitRemove: null,
      exitStart: null,
      previousCount: getToastSnapshot().length,
      registerLimit: null,
      syncing: false,
      trigger: null,
      triggerCleanup: null,
      unsubscribe: null,
    };
    listStates.set(list, state);
  }
  return state;
}

function clearItemTimer(item: HTMLElement) {
  const state = itemState(item);
  if (state.timeout != null) clearTimeout(state.timeout);
  state.timeout = null;
}

function scheduleItemTimer(item: HTMLElement) {
  const state = itemState(item);
  clearItemTimer(item);
  if (!state.dismiss) return;
  if (state.pausedByList || item.matches(":hover") || item.matches(":focus")) return;
  state.timeout = setTimeout(() => state.dismiss?.(), state.duration);
}

function setItemListPaused(item: HTMLElement, paused: boolean) {
  const state = itemState(item);
  state.pausedByList = paused;
  if (paused) clearItemTimer(item);
  else scheduleItemTimer(item);
}

function configureItem(item: HTMLElement, record: ToastRecord, index: number) {
  const state = itemState(item);
  state.dismiss = record.onClose;
  state.duration = record.duration;
  item.dataset.toastId = record.id;
  item.dataset.index = String(index);
  syncItem(item);
}

function stackVariables(item: HTMLElement, index: number, count: number, visible: number, offset: number, scaleStep: number) {
  const itemOffset = index * offset;
  const scale = Math.max(0, 1 - index * scaleStep);
  const exitScale = Math.max(0, 1 - (index + 1) * scaleStep);
  item.style.setProperty("--toast-count", String(count));
  item.style.setProperty("--toast-index", String(index));
  item.style.setProperty("--toast-offset", `${-itemOffset}px`);
  item.style.setProperty("--toast-offset-up", `${-itemOffset}px`);
  item.style.setProperty("--toast-offset-down", `${itemOffset}px`);
  item.style.setProperty("--toast-scale", String(scale));
  item.style.setProperty("--toast-exit-scale", String(exitScale));
  item.style.setProperty("--toast-visible-toasts", String(visible));
  item.style.setProperty("--toast-z-index", String(count - index));
}

function clearStackExit(state: ListState) {
  if (state.exitStart != null) clearTimeout(state.exitStart);
  if (state.exitFade != null) clearTimeout(state.exitFade);
  if (state.exitRemove != null) clearTimeout(state.exitRemove);
  state.exitStart = null;
  state.exitFade = null;
  state.exitRemove = null;
  state.exitId = null;
}

function scheduleStackExit(list: HTMLElement, id: string) {
  const state = listState(list);
  if (state.exitId === id) return;
  clearStackExit(state);
  state.exitId = id;
  state.exitStart = setTimeout(() => {
    const item = Array.from(list.querySelectorAll<HTMLElement>("aria-toast-item"))
      .find((candidate) => candidate.dataset.toastId === id);
    if (!item) return;
    item.dataset.exiting = "true";
    item.dataset.removed = "true";
    item.dataset.exitPhase = "scale";
    state.exitFade = setTimeout(() => {
      item.dataset.exitPhase = "fade";
    }, 150);
    state.exitRemove = setTimeout(() => {
      state.exitId = null;
      dismissToast(id);
    }, 300);
  }, 300);
}

function renderedRecords(list: HTMLElement) {
  const stack = list.hasAttribute("stack");
  const visible = Math.floor(numberAttribute(list, "visible-toasts", 3, 1));
  const snapshot = getToastSnapshot();
  if (!stack) return snapshot.slice(0, visible);
  if (snapshot.length > visible + 1) {
    retainToasts(snapshot.slice(0, visible + 1).map((toast) => toast.id));
    return getToastSnapshot();
  }
  return snapshot.slice(0, visible + 1);
}

export function connectToastPart(element: HTMLElement) {
  const part = partName(element);
  if (part === "List") connectList(element);
  if (part === "Item") connectItem(element);
  if (part === "Close") connectClose(element);
  syncToastPart(element);
}

export function disconnectToastPart(element: HTMLElement) {
  if (partName(element) === "Item") clearItemTimer(element);
  if (partName(element) !== "List") return;
  const state = listState(element);
  state.unsubscribe?.();
  state.registerLimit?.();
  state.triggerCleanup?.();
  state.unsubscribe = null;
  state.registerLimit = null;
  state.triggerCleanup = null;
  clearStackExit(state);
  clearToasts();
}

function connectList(list: HTMLElement) {
  const state = listState(list);
  state.unsubscribe ??= subscribeToToasts(() => syncList(list));
  if (state.bound) {
    updateListLimit(list);
    return;
  }
  state.bound = true;
  list.addEventListener("pointerenter", () => {
    state.expanded = list.hasAttribute("stack");
    syncListInteraction(list, true);
  });
  list.addEventListener("pointerleave", () => {
    state.expanded = false;
    syncListInteraction(list, false);
  });
  list.addEventListener("focusin", () => {
    if (list.hasAttribute("stack")) state.expanded = true;
    syncListState(list);
  });
  list.addEventListener("focusout", (event) => {
    if (!(event.relatedTarget instanceof Node) || !list.contains(event.relatedTarget)) state.expanded = false;
    syncListState(list);
  });
  updateListLimit(list);
}

function connectItem(item: HTMLElement) {
  if (boundItems.has(item)) return;
  boundItems.add(item);
  item.addEventListener("mouseenter", () => clearItemTimer(item));
  item.addEventListener("mouseleave", () => scheduleItemTimer(item));
  item.addEventListener("focus", () => clearItemTimer(item));
  item.addEventListener("blur", () => scheduleItemTimer(item));
  scheduleItemTimer(item);
}

function connectClose(close: HTMLElement) {
  if (boundCloses.has(close)) return;
  boundCloses.add(close);
  close.addEventListener("click", (event) => {
    if (event.defaultPrevented) return;
    const item = close.closest<HTMLElement>("aria-toast-item");
    itemStates.get(item!)?.dismiss?.();
  });
}

function syncListInteraction(list: HTMLElement, paused: boolean) {
  for (const item of list.querySelectorAll<HTMLElement>("aria-toast-item")) setItemListPaused(item, paused);
  syncListState(list);
}

function syncListState(list: HTMLElement) {
  const state = listState(list);
  if (list.hasAttribute("stack")) {
    list.dataset.stack = "true";
    list.dataset.expanded = String(state.expanded);
    for (const item of list.querySelectorAll<HTMLElement>("aria-toast-item")) item.dataset.expanded = String(state.expanded);
  } else {
    delete list.dataset.stack;
    delete list.dataset.expanded;
  }
}

function updateListLimit(list: HTMLElement) {
  const state = listState(list);
  state.registerLimit?.();
  state.registerLimit = null;
  if (!list.hasAttribute("stack")) {
    state.registerLimit = registerToastLimit(Math.floor(numberAttribute(list, "visible-toasts", 3, 1)));
  }
}

function syncList(list: HTMLElement) {
  const state = listState(list);
  if (state.syncing || !list.isConnected) return;
  state.syncing = true;
  try {
    const records = renderedRecords(list);
    const stack = list.hasAttribute("stack");
    const visible = Math.floor(numberAttribute(list, "visible-toasts", 3, 1));
    const offset = numberAttribute(list, "stack-offset", 14);
    const scaleStep = numberAttribute(list, "stack-scale-step", 0.08);
    const existing = new Map(Array.from(list.querySelectorAll<HTMLElement>("aria-toast-item[data-toast-id]"), (item) => [item.dataset.toastId!, item]));
    const retained = new Set(records.map((record) => record.id));

    for (const [id, item] of existing) {
      if (!retained.has(id)) item.remove();
    }

    records.forEach((record, index) => {
      let item = existing.get(record.id);
      if (!item) {
        item = cloneToastTemplate(record.template);
        if (!item.matches("aria-toast-item")) throw new TypeError("Toast templates must create an aria-toast-item element.");
        configureItem(item, record, index);
        item.dataset.mounted = "false";
        const position = list.querySelectorAll(":scope > aria-toast-item")[index] ?? null;
        list.insertBefore(item, position);
        if (stack) item.getBoundingClientRect();
        item.dataset.mounted = "true";
      } else {
        configureItem(item, record, index);
        const position = list.querySelectorAll(":scope > aria-toast-item")[index] ?? null;
        if (position !== item) list.insertBefore(item, position);
      }
      if (stack) {
        item.dataset.stack = "true";
        item.dataset.expanded = String(state.expanded);
        item.dataset.exiting ||= "false";
        item.dataset.front = String(index === 0);
        item.dataset.visible = String(state.expanded || index <= visible);
        stackVariables(item, index, records.length, visible, offset, scaleStep);
      }
    });

    if (stack && records.length > visible) scheduleStackExit(list, records[visible]!.id);
    else if (!stack || records.length <= visible) clearStackExit(state);
    syncListState(list);

    const nextCount = getToastSnapshot().length;
    if (state.previousCount > 0 && nextCount === 0 && state.trigger && focusRestoreTarget === state.trigger) {
      state.trigger.focus({ preventScroll: true });
      focusRestoreTarget = null;
    }
    state.previousCount = nextCount;
  } finally {
    state.syncing = false;
  }
}

function syncItem(item: HTMLElement) {
  item.setAttribute("role", "status");
  item.setAttribute("aria-live", "off");
  item.setAttribute("aria-atomic", "true");
  item.setAttribute("tabindex", item.getAttribute("tabindex") ?? "0");
  item.dataset.state = "open";
  item.dataset.mounted ||= "true";
  item.dataset.removed ||= "false";
}

function syncClose(close: HTMLElement) {
  close.setAttribute("role", "button");
  close.setAttribute("tabindex", close.getAttribute("tabindex") ?? "0");
}

export function syncToastPart(element: HTMLElement) {
  const part = partName(element);
  if (part === "List") {
    element.setAttribute("role", "region");
    element.setAttribute("aria-live", element.getAttribute("aria-live") ?? "polite");
    element.setAttribute("aria-label", element.getAttribute("aria-label") ?? "Notifications");
    element.setAttribute("tabindex", element.getAttribute("tabindex") ?? "0");
    updateListLimit(element);
    syncList(element);
  }
  if (part === "Item") {
    if (!element.dataset.toastId) itemState(element).duration = numberAttribute(element, "duration", 3000);
    syncItem(element);
    if (element.isConnected && boundItems.has(element)) scheduleItemTimer(element);
  }
  if (part === "Close") syncClose(element);
}

export function getToastTrigger(list: HTMLElement) {
  return listState(list).trigger;
}

export function setToastTrigger(list: HTMLElement, trigger: HTMLElement | null) {
  const state = listState(list);
  state.triggerCleanup?.();
  state.trigger = trigger;
  state.triggerCleanup = null;
  if (!trigger) return;

  const markRestoreTarget = () => {
    focusRestoreTarget = trigger;
  };
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.code !== "Tab") return;
    event.preventDefault();
    event.stopPropagation();
    markRestoreTarget();
    list.focus();
  };
  trigger.addEventListener("click", markRestoreTarget);
  trigger.addEventListener("keydown", handleKeydown);
  state.triggerCleanup = () => {
    trigger.removeEventListener("click", markRestoreTarget);
    trigger.removeEventListener("keydown", handleKeydown);
  };
}

export function getToastItemOnClose(item: HTMLElement) {
  return itemState(item).dismiss;
}

export function setToastItemOnClose(item: HTMLElement, onClose: (() => void) | null) {
  itemState(item).dismiss = onClose;
  if (item.isConnected) scheduleItemTimer(item);
}
