export type SeparatorOrientation = "horizontal" | "vertical";

type SeparatorState = {
  authoredAriaOrientation: string | null;
  authoredRole: string | null;
  composedHost: HTMLElement | null;
  hostAuthoredAriaOrientation: string | null;
  hostAuthoredRole: string | null;
  initialized: boolean;
  observer: MutationObserver | null;
  syncing: boolean;
};

const states = new WeakMap<HTMLElement, SeparatorState>();

function stateFor(separator: HTMLElement) {
  let state = states.get(separator);
  if (!state) {
    state = {
      authoredAriaOrientation: null,
      authoredRole: null,
      composedHost: null,
      hostAuthoredAriaOrientation: null,
      hostAuthoredRole: null,
      initialized: false,
      observer: null,
      syncing: false,
    };
    states.set(separator, state);
  }
  return state;
}

export function separatorOrientation(separator: HTMLElement): SeparatorOrientation {
  return separator.getAttribute("orientation") === "vertical" ? "vertical" : "horizontal";
}

export function initializeSeparator(separator: HTMLElement) {
  const state = stateFor(separator);
  if (state.initialized) return;
  state.authoredRole = separator.getAttribute("role");
  state.authoredAriaOrientation = separator.getAttribute("aria-orientation");
  state.initialized = true;
}

function composedHost(separator: HTMLElement) {
  return separator.hasAttribute("native-composition") && separator.firstElementChild instanceof HTMLElement
    ? separator.firstElementChild
    : separator;
}

function copyCompositionAttributes(separator: HTMLElement, host: HTMLElement) {
  for (const token of separator.classList) host.classList.add(token);
  for (const property of Array.from(separator.style)) {
    if (property !== "display" && !host.style.getPropertyValue(property)) {
      host.style.setProperty(property, separator.style.getPropertyValue(property), separator.style.getPropertyPriority(property));
    }
  }
  for (const attribute of Array.from(separator.attributes)) {
    if (
      attribute.name === "aria-orientation" ||
      attribute.name === "class" ||
      attribute.name === "decorative" ||
      attribute.name === "native-composition" ||
      attribute.name === "orientation" ||
      attribute.name === "role" ||
      attribute.name === "style" ||
      attribute.name === "part" ||
      attribute.name === "data-ariaui-web" ||
      attribute.name === "data-orientation" ||
      attribute.name === "data-package" ||
      attribute.name === "data-part"
    ) continue;
    if (!host.hasAttribute(attribute.name)) host.setAttribute(attribute.name, attribute.value);
  }
}

function syncSemantics(
  host: HTMLElement,
  orientation: SeparatorOrientation,
  decorative: boolean,
  authoredRole: string | null,
  authoredAriaOrientation: string | null,
) {
  host.setAttribute("role", authoredRole ?? (decorative ? "none" : "separator"));
  if (authoredAriaOrientation != null) {
    host.setAttribute("aria-orientation", authoredAriaOrientation);
  } else if (!decorative && orientation === "vertical") {
    host.setAttribute("aria-orientation", "vertical");
  } else {
    host.removeAttribute("aria-orientation");
  }
  host.setAttribute("data-orientation", orientation);
}

export function syncSeparator(separator: HTMLElement) {
  initializeSeparator(separator);
  const state = stateFor(separator);
  if (state.syncing) return;
  state.syncing = true;
  try {
    const orientation = separatorOrientation(separator);
    const decorative = separator.hasAttribute("decorative");
    const host = composedHost(separator);

    if (host === separator) {
      separator.style.removeProperty("display");
      syncSemantics(separator, orientation, decorative, state.authoredRole, state.authoredAriaOrientation);
      state.composedHost = null;
      return;
    }

    if (state.composedHost !== host) {
      state.composedHost = host;
      state.hostAuthoredRole = host.getAttribute("role");
      state.hostAuthoredAriaOrientation = host.getAttribute("aria-orientation");
    }
    separator.style.display = "contents";
    copyCompositionAttributes(separator, host);
    syncSemantics(
      host,
      orientation,
      decorative,
      state.hostAuthoredRole ?? state.authoredRole,
      state.hostAuthoredAriaOrientation ?? state.authoredAriaOrientation,
    );
    separator.setAttribute("data-orientation", orientation);
    separator.setAttribute("role", "none");
    separator.removeAttribute("aria-orientation");
  } finally {
    state.syncing = false;
  }
}

export function observeSeparator(separator: HTMLElement) {
  const state = stateFor(separator);
  if (state.observer || typeof MutationObserver === "undefined") return;
  state.observer = new MutationObserver(() => syncSeparator(separator));
  state.observer.observe(separator, { childList: true });
}

export function disconnectSeparator(separator: HTMLElement) {
  const state = states.get(separator);
  state?.observer?.disconnect();
  states.delete(separator);
}
