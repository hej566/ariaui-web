import {
  scrollAreaPartName,
  scrollAreaRoot,
  scrollAreaScrollbars,
  scrollAreaThumbs,
  scrollAreaViewport,
  scrollAreaViewportHost,
} from "./scroll-area-dom";
import { anchorSelectedItem, getScrollButtonOffset } from "./scroll-area-values";

type ViewportState = {
  mutationObserver: MutationObserver | null;
  observedFirst: HTMLElement | null;
  resizeObserver: ResizeObserver | null;
  syncing: boolean;
};

const viewportStates = new WeakMap<HTMLElement, ViewportState>();
const rootObservers = new WeakMap<HTMLElement, MutationObserver>();

function viewportState(viewport: HTMLElement) {
  let state = viewportStates.get(viewport);
  if (!state) {
    state = { mutationObserver: null, observedFirst: null, resizeObserver: null, syncing: false };
    viewportStates.set(viewport, state);
  }
  return state;
}

function copyViewportAttributes(source: HTMLElement, host: HTMLElement) {
  if (source === host) return;
  source.style.display = "contents";
  for (const token of source.classList) host.classList.add(token);
  for (const property of Array.from(source.style)) {
    if (property !== "display") host.style.setProperty(property, source.style.getPropertyValue(property), source.style.getPropertyPriority(property));
  }
  for (const attribute of Array.from(source.attributes)) {
    if (
      attribute.name === "class" ||
      attribute.name === "style" ||
      attribute.name === "native-composition" ||
      attribute.name === "part" ||
      attribute.name.startsWith("data-ariaui-web") ||
      attribute.name === "data-package" ||
      attribute.name === "data-part"
    ) continue;
    host.setAttribute(attribute.name, attribute.value);
  }
}

function setViewportDefaults(host: HTMLElement) {
  host.dataset.ariauiScrollAreaViewport = "true";
  if (!host.style.width) host.style.width = "100%";
  if (!host.style.height) host.style.height = "100%";
  if (!host.style.overflowX) host.style.overflowX = "auto";
  if (!host.style.overflowY) host.style.overflowY = "auto";
  if (!host.hasAttribute("tabindex")) host.tabIndex = -1;
}

function measureViewport(viewport: HTMLElement, host: HTMLElement, state: ViewportState) {
  const count = Number(viewport.getAttribute("max-visible-items"));
  if (!Number.isFinite(count) || count <= 0) {
    state.resizeObserver?.disconnect();
    state.resizeObserver = null;
    state.observedFirst = null;
    host.style.removeProperty("max-height");
    return;
  }

  const first = host.firstElementChild;
  const rowHeight = first instanceof HTMLElement ? first.getBoundingClientRect().height : 0;
  if (rowHeight > 0) host.style.maxHeight = `${rowHeight * count}px`;
  else host.style.removeProperty("max-height");

  const nextFirst = first instanceof HTMLElement ? first : null;
  if (nextFirst === state.observedFirst) return;
  state.resizeObserver?.disconnect();
  state.resizeObserver = null;
  state.observedFirst = nextFirst;
  if (nextFirst && typeof ResizeObserver !== "undefined") {
    state.resizeObserver = new ResizeObserver(() => syncScrollAreaViewport(viewport));
    state.resizeObserver.observe(nextFirst);
  }
}

export function syncScrollAreaViewport(viewport: HTMLElement) {
  const state = viewportState(viewport);
  if (state.syncing) return;
  state.syncing = true;
  try {
    const host = scrollAreaViewportHost(viewport);
    copyViewportAttributes(viewport, host);
    setViewportDefaults(host);
    measureViewport(viewport, host, state);
    if (viewport.hasAttribute("anchor-selected")) anchorSelectedItem(host);
  } finally {
    state.syncing = false;
  }
}

export function observeScrollAreaViewport(viewport: HTMLElement) {
  const state = viewportState(viewport);
  if (state.mutationObserver || typeof MutationObserver === "undefined") return;
  state.mutationObserver = new MutationObserver(() => syncScrollAreaViewport(viewport));
  state.mutationObserver.observe(viewport, {
    attributes: true,
    attributeFilter: ["aria-selected", "data-state"],
    childList: true,
    subtree: true,
  });
}

export function disconnectScrollAreaViewport(viewport: HTMLElement) {
  const state = viewportStates.get(viewport);
  state?.mutationObserver?.disconnect();
  state?.resizeObserver?.disconnect();
  viewportStates.delete(viewport);
}

function syncScrollbar(scrollbar: HTMLElement, root: HTMLElement | null) {
  const hidden = root?.getAttribute("type") === "never";
  scrollbar.hidden = hidden;
  scrollbar.setAttribute("data-orientation", scrollbar.getAttribute("orientation") === "horizontal" ? "horizontal" : "vertical");
  scrollbar.setAttribute("data-state", "visible");
  for (const thumb of scrollAreaThumbs(scrollbar)) thumb.setAttribute("data-state", "visible");
}

export function syncScrollAreaRoot(root: HTMLElement) {
  for (const scrollbar of scrollAreaScrollbars(root)) syncScrollbar(scrollbar, root);
  const viewport = scrollAreaViewport(root);
  if (viewport) syncScrollAreaViewport(viewport);
}

export function observeScrollAreaRoot(root: HTMLElement) {
  if (rootObservers.has(root) || typeof MutationObserver === "undefined") return;
  const observer = new MutationObserver(() => syncScrollAreaRoot(root));
  observer.observe(root, { childList: true, subtree: true });
  rootObservers.set(root, observer);
}

export function disconnectScrollAreaRoot(root: HTMLElement) {
  rootObservers.get(root)?.disconnect();
  rootObservers.delete(root);
}

export function syncScrollAreaElement(element: HTMLElement) {
  const part = scrollAreaPartName(element);
  if (part === "Root") syncScrollAreaRoot(element);
  else if (part === "Viewport") syncScrollAreaViewport(element);
  else if (part === "Scrollbar") syncScrollbar(element, scrollAreaRoot(element));
  else if (part === "Thumb") element.setAttribute("data-state", "visible");
  else if (part === "ScrollUpButton") element.setAttribute("data-direction", "up");
  else if (part === "ScrollDownButton") element.setAttribute("data-direction", "down");
}

export function requestScrollAreaButtonScroll(button: HTMLElement, event: Event) {
  const direction = scrollAreaPartName(button) === "ScrollUpButton" ? -1 : 1;
  queueMicrotask(() => {
    if (event.defaultPrevented || !button.isConnected) return;
    const root = scrollAreaRoot(button);
    const source = root ? scrollAreaViewport(root) : null;
    const viewport = source ? scrollAreaViewportHost(source) : null;
    viewport?.scrollBy?.({
      top: direction * getScrollButtonOffset(viewport),
      behavior: button.getAttribute("behavior") === "auto" ? "auto" : "smooth",
    });
  });
}
