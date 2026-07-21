import {
  isRadioIndicator,
  isRadioItem,
  isRadioRoot,
  radioIndicatorOwner,
  radioIndicators,
  radioItemDisabled,
  radioItems,
  radioRoot,
} from "./radio-dom";

type RadioState = {
  controlled: boolean;
  defaultValueApplied: boolean;
  managesActiveDescendant: boolean;
  observer: MutationObserver | null;
  syncing: boolean;
};

const states = new WeakMap<HTMLElement, RadioState>();
let radioItemId = 0;

function radioState(root: HTMLElement) {
  let state = states.get(root);
  if (!state) {
    state = {
      controlled: root.hasAttribute("value"),
      defaultValueApplied: false,
      managesActiveDescendant: !root.hasAttribute("aria-activedescendant"),
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
  if (element.hasAttribute(name) !== value)
    element.toggleAttribute(name, value);
}

function ensureItemId(item: HTMLElement) {
  if (!item.id) {
    radioItemId += 1;
    item.id = `ariaui-radio-item-${radioItemId}`;
  }
}

function syncHiddenInput(
  item: HTMLElement,
  checked: boolean,
  disabled: boolean,
) {
  const existing = item.querySelector<HTMLInputElement>(
    "input[data-ariaui-web-hidden-input='true']",
  );
  const name = item.getAttribute("name");
  if (!checked || !name) {
    existing?.remove();
    return;
  }

  const input = existing ?? item.ownerDocument.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = item.getAttribute("value") ?? "";
  input.required = item.hasAttribute("required");
  input.disabled = disabled;
  input.dataset.ariauiWebHiddenInput = "true";
  if (!existing) item.append(input);
}

function syncIndicator(
  indicator: HTMLElement,
  checked: boolean,
  disabled: boolean,
) {
  setAttribute(indicator, "data-state", checked ? "checked" : "unchecked");
  setBoolean(indicator, "data-disabled", disabled);
}

function syncOrphanItem(item: HTMLElement) {
  item.removeAttribute("checked");
  setAttribute(item, "aria-checked", "false");
  setAttribute(item, "data-state", "unchecked");
  setAttribute(item, "tabindex", "-1");
  syncHiddenInput(item, false, item.hasAttribute("disabled"));
  for (const indicator of radioIndicators(item)) {
    syncIndicator(indicator, false, item.hasAttribute("disabled"));
  }
}

export function radioRootIsControlled(root: HTMLElement) {
  return radioState(root).controlled;
}

export function observeRadioTree(root: HTMLElement) {
  const state = radioState(root);
  if (state.observer || typeof MutationObserver === "undefined") return;
  state.observer = new MutationObserver(() => syncRadioRoot(root));
  state.observer.observe(root, { childList: true, subtree: true });
}

export function disconnectRadioTree(root: HTMLElement) {
  const state = states.get(root);
  state?.observer?.disconnect();
  if (state) state.observer = null;
}

export function syncRadioAround(element: HTMLElement) {
  installRadioLabelActivation(element.ownerDocument);
  if (isRadioRoot(element)) {
    syncRadioRoot(element);
    return;
  }
  if (isRadioItem(element)) {
    const root = radioRoot(element);
    if (root) syncRadioRoot(root);
    else syncOrphanItem(element);
    return;
  }
  if (isRadioIndicator(element)) {
    const owner = radioIndicatorOwner(element);
    const root = owner ? radioRoot(owner) : null;
    if (root) syncRadioRoot(root);
    else
      syncIndicator(element, false, Boolean(owner?.hasAttribute("disabled")));
  }
}

export function syncRadioRoot(root: HTMLElement) {
  const state = radioState(root);
  if (state.syncing) return;
  state.syncing = true;
  try {
    if (!state.defaultValueApplied) {
      const defaultValue =
        root.getAttribute("default-value") ?? root.getAttribute("defaultvalue");
      if (!root.hasAttribute("value") && defaultValue != null)
        root.setAttribute("value", defaultValue);
      state.defaultValueApplied = true;
    }

    const items = radioItems(root);
    for (const item of items) ensureItemId(item);

    const hasValue = root.hasAttribute("value");
    const value = root.getAttribute("value") ?? "";
    const selected = hasValue
      ? (items.find((item) => item.getAttribute("value") === value) ?? null)
      : null;
    const firstEnabled =
      items.find((item) => !radioItemDisabled(item, root)) ?? null;
    const tabStop =
      selected && !radioItemDisabled(selected, root)
        ? selected
        : selected
          ? null
          : firstEnabled;
    const groupDisabled = root.hasAttribute("disabled");

    setBoolean(root, "data-disabled", groupDisabled);
    root.removeAttribute("aria-disabled");

    for (const item of items) {
      const checked = item === selected;
      const disabled = radioItemDisabled(item, root);
      setBoolean(item, "checked", checked);
      setAttribute(item, "aria-checked", String(checked));
      setAttribute(item, "data-state", checked ? "checked" : "unchecked");
      setAttribute(item, "tabindex", item === tabStop ? "0" : "-1");
      if (disabled) setAttribute(item, "aria-disabled", "true");
      else item.removeAttribute("aria-disabled");
      setBoolean(item, "data-disabled", disabled);
      syncHiddenInput(item, checked, disabled);
      for (const indicator of radioIndicators(item))
        syncIndicator(indicator, checked, disabled);
    }

    if (state.managesActiveDescendant) {
      if (selected) setAttribute(root, "aria-activedescendant", selected.id);
      else root.removeAttribute("aria-activedescendant");
    }
  } finally {
    state.syncing = false;
  }
}

const labelDocuments = new WeakSet<Document>();

function installRadioLabelActivation(ownerDocument: Document) {
  if (labelDocuments.has(ownerDocument)) return;
  ownerDocument.addEventListener("click", (event) => {
    if (event.defaultPrevented) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const label = target.closest("label[for]");
    const controlId = label instanceof HTMLLabelElement ? label.htmlFor : "";
    if (!controlId) return;
    const control = ownerDocument.getElementById(controlId);
    if (!isRadioItem(control) || label?.contains(control)) return;
    control.click();
  });
  labelDocuments.add(ownerDocument);
}
