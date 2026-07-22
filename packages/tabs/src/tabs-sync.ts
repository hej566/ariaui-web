import {
  isTabsRoot,
  tabsContents,
  tabsElements,
  tabsNativeTarget,
  tabsRoot,
  tabsTriggerDisabled,
  tabsTriggers,
} from "./tabs-dom";

type TabsState = {
  controlled: boolean;
  defaultValueApplied: boolean;
  observer: MutationObserver | null;
  syncing: boolean;
};

const states = new WeakMap<HTMLElement, TabsState>();
const triggerIds = new WeakMap<HTMLElement, string>();
const panelIds = new WeakMap<HTMLElement, string>();
const compositionStates = new WeakMap<HTMLElement, {
  forwarded: Set<string>;
  originals: Map<string, string | null>;
  target: HTMLElement;
}>();
let nextTabsId = 0;

function stateFor(root: HTMLElement) {
  let state = states.get(root);
  if (!state) {
    state = {
      controlled: root.hasAttribute("value"),
      defaultValueApplied: false,
      observer: null,
      syncing: false,
    };
    states.set(root, state);
  }
  return state;
}

function setAttribute(element: Element, name: string, value: string) {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value);
}

function setBoolean(element: Element, name: string, value: boolean) {
  if (element.hasAttribute(name) !== value) element.toggleAttribute(name, value);
}

function stableId(element: HTMLElement, kind: "tab" | "panel") {
  const ids = kind === "tab" ? triggerIds : panelIds;
  const existing = ids.get(element);
  if (existing) return existing;
  nextTabsId += 1;
  const id = element.id || `ariaui-tabs-${kind}-${nextTabsId}`;
  ids.set(element, id);
  return id;
}

function clearHostSemantics(host: HTMLElement, attributes: string[]) {
  for (const attribute of attributes) host.removeAttribute(attribute);
}

const internalCompositionAttributes = new Set([
  "aria-controls", "aria-disabled", "aria-labelledby", "aria-selected",
  "data-ariaui-web", "data-disabled", "data-orientation", "data-package",
  "data-part", "data-state", "data-value", "default-value", "defaultvalue",
  "disabled", "hidden", "id", "native-composition", "orientation", "part",
  "role", "tabindex", "value",
]);

function syncConsumerAttributes(host: HTMLElement, target: HTMLElement) {
  const previous = compositionStates.get(host);
  if (previous && previous.target !== target) {
    for (const name of previous.forwarded) {
      const original = previous.originals.get(name);
      if (original == null) previous.target.removeAttribute(name);
      else previous.target.setAttribute(name, original);
    }
    compositionStates.delete(host);
  }
  if (target === host) return;

  const state = compositionStates.get(host) ?? {
    forwarded: new Set<string>(),
    originals: new Map<string, string | null>(),
    target,
  };
  const next = new Set<string>();
  for (const attribute of Array.from(host.attributes)) {
    const name = attribute.name;
    if (internalCompositionAttributes.has(name)) continue;
    next.add(name);
    if (!state.originals.has(name)) state.originals.set(name, target.getAttribute(name));
    if (name === "class") {
      const original = state.originals.get(name) ?? "";
      const className = Array.from(new Set(`${original} ${attribute.value}`.trim().split(/\s+/))).join(" ");
      target.setAttribute(name, className);
    } else {
      target.setAttribute(name, attribute.value);
    }
  }
  for (const name of state.forwarded) {
    if (next.has(name)) continue;
    const original = state.originals.get(name);
    if (original == null) target.removeAttribute(name);
    else target.setAttribute(name, original);
  }
  state.forwarded = next;
  compositionStates.set(host, state);
}

function compositionTarget(host: HTMLElement) {
  const target = tabsNativeTarget(host);
  syncConsumerAttributes(host, target);
  return target;
}

function syncList(list: HTMLElement, orientation: string) {
  const target = compositionTarget(list);
  if (target !== list) clearHostSemantics(list, ["role", "aria-orientation"]);
  setAttribute(target, "role", "tablist");
  setAttribute(target, "aria-orientation", orientation);
}

function syncTrigger(
  trigger: HTMLElement,
  content: HTMLElement | undefined,
  selected: boolean,
  root: HTMLElement,
) {
  const target = compositionTarget(trigger);
  const disabled = tabsTriggerDisabled(trigger, root);
  const triggerId = stableId(trigger, "tab");
  const panelId = content ? stableId(content, "panel") : `${triggerId}-panel`;

  if (target !== trigger) {
    clearHostSemantics(trigger, ["role", "aria-controls", "aria-selected", "aria-disabled", "tabindex", "id"]);
  }
  setAttribute(target, "id", triggerId);
  setAttribute(target, "role", "tab");
  setAttribute(target, "aria-controls", panelId);
  setAttribute(target, "aria-selected", String(selected));
  setAttribute(target, "tabindex", selected && !disabled ? "0" : "-1");
  if (disabled) setAttribute(target, "aria-disabled", "true");
  else target.removeAttribute("aria-disabled");
  setBoolean(trigger, "data-disabled", disabled);
}

function syncContent(content: HTMLElement, trigger: HTMLElement | undefined, selected: boolean) {
  const target = compositionTarget(content);
  const panelId = stableId(content, "panel");
  const triggerTarget = trigger ? tabsNativeTarget(trigger) : null;

  if (target !== content) {
    clearHostSemantics(content, ["role", "aria-labelledby", "hidden", "tabindex", "id"]);
  }
  setAttribute(target, "id", panelId);
  setAttribute(target, "role", "tabpanel");
  if (triggerTarget) setAttribute(target, "aria-labelledby", triggerTarget.id);
  else target.removeAttribute("aria-labelledby");
  setBoolean(target, "hidden", !selected);
  setAttribute(content, "data-state", selected ? "active" : "inactive");
}

export function tabsRootIsControlled(root: HTMLElement) {
  return stateFor(root).controlled;
}

export function observeTabsRoot(root: HTMLElement) {
  const state = stateFor(root);
  if (!state.observer && typeof MutationObserver !== "undefined") {
    state.observer = new MutationObserver(() => syncTabsRoot(root));
    state.observer.observe(root, { childList: true, subtree: true });
  }
  syncTabsRoot(root);
}

export function disconnectTabsRoot(root: HTMLElement) {
  const state = states.get(root);
  state?.observer?.disconnect();
  if (state) state.observer = null;
}

export function syncTabsAround(element: HTMLElement) {
  if (isTabsRoot(element)) {
    syncTabsRoot(element);
    return;
  }
  const root = tabsRoot(element);
  if (root) syncTabsRoot(root);
}

export function syncTabsRoot(root: HTMLElement) {
  const state = stateFor(root);
  if (state.syncing) return;
  state.syncing = true;
  try {
    if (!state.defaultValueApplied) {
      const defaultValue = root.getAttribute("default-value") ?? root.getAttribute("defaultvalue");
      if (!root.hasAttribute("value") && defaultValue != null) root.setAttribute("value", defaultValue);
      state.defaultValueApplied = true;
    }

    const orientation = root.getAttribute("orientation") === "vertical" ? "vertical" : "horizontal";
    setAttribute(root, "data-orientation", orientation);
    compositionTarget(root);
    const triggers = tabsTriggers(root);
    const contents = tabsContents(root);
    const requested = root.getAttribute("value");
    let selected = requested == null
      ? undefined
      : triggers.find((trigger) => trigger.getAttribute("value") === requested);

    if ((!selected || tabsTriggerDisabled(selected, root)) && requested != null && !state.controlled) {
      selected = triggers.find((trigger) => !tabsTriggerDisabled(trigger, root));
      if (selected) root.setAttribute("value", selected.getAttribute("value") ?? "");
      else root.removeAttribute("value");
    }

    const selectedValue = selected?.getAttribute("value") ?? null;
    for (const list of tabsElements(root, "aria-tabs-list")) syncList(list, orientation);
    for (const panel of tabsElements(root, "aria-tabs-panel")) panel.removeAttribute("role");
    for (const trigger of triggers) {
      const value = trigger.getAttribute("value");
      const content = contents.find((candidate) => candidate.getAttribute("value") === value);
      syncTrigger(trigger, content, trigger === selected, root);
    }
    for (const content of contents) {
      const value = content.getAttribute("value");
      const trigger = triggers.find((candidate) => candidate.getAttribute("value") === value);
      syncContent(content, trigger, value != null && value === selectedValue);
    }
  } finally {
    state.syncing = false;
  }
}
