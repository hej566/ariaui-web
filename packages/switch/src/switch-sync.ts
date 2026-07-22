import { isSwitchRoot, switchPartName, switchParts, switchRoot } from "./switch-dom";

type SwitchState = {
  controlId: string | null;
  input?: HTMLInputElement;
  observer?: MutationObserver;
  syncing: boolean;
};

const states = new WeakMap<HTMLElement, SwitchState>();
const boundInputs = new WeakSet<HTMLInputElement>();

function stateFor(root: HTMLElement) {
  let state = states.get(root);
  if (!state) {
    state = { controlId: root.getAttribute("id"), syncing: false };
    states.set(root, state);
  }
  return state;
}

export function observeSwitchRoot(root: HTMLElement) {
  const state = stateFor(root);
  if (!state.observer) {
    state.observer = new MutationObserver(() => syncSwitchRoot(root));
    state.observer.observe(root, { childList: true, subtree: true });
  }
  syncSwitchRoot(root);
}

export function disconnectSwitchRoot(root: HTMLElement) {
  const state = stateFor(root);
  state.observer?.disconnect();
  delete state.observer;
}

export function syncSwitchAround(element: HTMLElement) {
  const root = switchRoot(element);
  if (!root) {
    if (switchPartName(element) !== "Root") {
      throw new Error("Switch components must be used within Root");
    }
    return;
  }
  syncSwitchRoot(root);
}

export function syncSwitchRoot(root: HTMLElement) {
  const state = stateFor(root);
  if (state.syncing) return;

  state.syncing = true;
  try {
    captureControlId(root, state);
    const input = syncInput(root, state);
    const checked = root.hasAttribute("checked");
    const rootDisabled = root.hasAttribute("disabled");

    input.checked = checked;
    input.disabled = rootDisabled;
    input.required = root.hasAttribute("required");
    input.name = root.getAttribute("name") ?? "";
    input.value = root.getAttribute("value") ?? "on";
    input.id = state.controlId ?? "";

    for (const track of switchParts(root, "aria-switch-track")) {
      const disabled = rootDisabled || track.hasAttribute("disabled");
      track.setAttribute("role", "switch");
      track.setAttribute("aria-checked", String(checked));
      track.removeAttribute("data-state");
      track.setAttribute("tabindex", disabled ? "-1" : "0");
      if (disabled) {
        track.setAttribute("aria-disabled", "true");
        track.setAttribute("data-disabled", "");
      } else {
        track.removeAttribute("aria-disabled");
        track.removeAttribute("data-disabled");
      }
    }

    for (const thumb of switchParts(root, "aria-switch-thumb")) {
      thumb.setAttribute("data-state", checked ? "checked" : "unchecked");
      if (rootDisabled) thumb.setAttribute("data-disabled", "");
      else thumb.removeAttribute("data-disabled");
      syncNativeThumb(thumb, checked, rootDisabled);
    }
  } finally {
    state.syncing = false;
  }
}

function captureControlId(root: HTMLElement, state: SwitchState) {
  const authoredId = root.getAttribute("id");
  if (authoredId) state.controlId = authoredId;
  if (root.hasAttribute("id")) root.removeAttribute("id");
}

function syncInput(root: HTMLElement, state: SwitchState) {
  let input = state.input;
  if (!input || input.parentElement !== root) {
    input = root.querySelector<HTMLInputElement>(":scope > input[data-switch-input]") ?? root.ownerDocument.createElement("input");
    input.type = "checkbox";
    input.hidden = true;
    input.tabIndex = -1;
    input.dataset.switchInput = "";
    state.input = input;
  }

  if (!boundInputs.has(input)) {
    input.addEventListener("change", (event) => {
      event.stopPropagation();
      const owner = input!.parentElement;
      if (!isSwitchRoot(owner)) return;
      const root = owner as HTMLElement;
      if (input!.checked) root.setAttribute("checked", "");
      else root.removeAttribute("checked");
      syncSwitchRoot(root);
      root.dispatchEvent(new CustomEvent("checkedchange", {
        bubbles: true,
        detail: { checked: input!.checked },
      }));
    });
    boundInputs.add(input);
  }

  if (input.parentElement !== root) root.append(input);
  return input;
}

function syncNativeThumb(thumb: HTMLElement, checked: boolean, disabled: boolean) {
  if (!thumb.hasAttribute("native-composition")) return;
  const child = thumb.firstElementChild;
  if (!(child instanceof HTMLElement)) return;

  child.setAttribute("data-state", checked ? "checked" : "unchecked");
  if (disabled) child.setAttribute("data-disabled", "");
  else child.removeAttribute("data-disabled");
}
