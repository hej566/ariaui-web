import {
  clampPage,
  paginationContent,
  paginationNext,
  paginationPages,
  paginationPartName,
  paginationPrevious,
  paginationRoot,
  paginationWindow,
  positiveInteger,
  type PaginationItem,
  type PaginationRootElement,
} from "./pagination-dom";

type PaginationState = {
  defaultPage: number;
  lastSignature: string;
  observer: MutationObserver | null;
  page: number | null;
  syncing: boolean;
  templates: WeakMap<HTMLElement, Node[]>;
};

const states = new WeakMap<HTMLElement, PaginationState>();

function stateFor(root: HTMLElement) {
  const existing = states.get(root);
  if (existing) return existing;
  const state: PaginationState = {
    defaultPage: 1,
    lastSignature: "",
    observer: null,
    page: null,
    syncing: false,
    templates: new WeakMap(),
  };
  states.set(root, state);
  return state;
}

function setAttributeIfChanged(element: HTMLElement, name: string, value: string) {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value);
}

function removeAttributeIfPresent(element: HTMLElement, name: string) {
  if (element.hasAttribute(name)) element.removeAttribute(name);
}

export function paginationCurrentPage(root: HTMLElement) {
  const state = stateFor(root);
  const totalPages = paginationTotalPages(root);
  if (root.hasAttribute("page")) return clampPage(positiveInteger(root.getAttribute("page"), 1), totalPages);
  if (state.page != null) return clampPage(state.page, totalPages);
  state.defaultPage = clampPage(positiveInteger(root.getAttribute("default-page"), 1), totalPages);
  state.page = state.defaultPage;
  return state.page;
}

export function paginationTotalPages(root: HTMLElement) {
  return positiveInteger(root.getAttribute("total-pages"), 1);
}

export function paginationMaxVisiblePages(root: HTMLElement) {
  return positiveInteger(root.getAttribute("max-visible-pages"), 5);
}

function updateControl(control: HTMLElement | null, options: { disabled?: boolean; label: string; page: number }) {
  if (!control) return;
  setAttributeIfChanged(control, "aria-label", options.label);
  setAttributeIfChanged(control, "data-page", String(options.page));
  setAttributeIfChanged(control, "tabindex", options.disabled ? "-1" : "0");
  if (options.disabled) {
    setAttributeIfChanged(control, "aria-disabled", "true");
  } else {
    removeAttributeIfPresent(control, "aria-disabled");
  }
}

function originalTemplateNodes(state: PaginationState, pages: HTMLElement) {
  const existing = state.templates.get(pages);
  if (existing) return existing;
  const template = Array.from(pages.childNodes).map((node) => node.cloneNode(true));
  state.templates.set(pages, template);
  return template;
}

function configureGeneratedLink(link: HTMLElement, item: PaginationItem, currentPage: number) {
  if (item.type !== "page") {
    link.remove();
    return;
  }
  setAttributeIfChanged(link, "data-page", String(item.page));
  if (!link.textContent?.trim()) link.textContent = String(item.page);
  if (item.page === currentPage) {
    setAttributeIfChanged(link, "aria-current", "page");
    const activeClass = link.getAttribute("active-class") ?? link.getAttribute("active-class-name");
    if (activeClass) link.className = activeClass;
  } else {
    removeAttributeIfPresent(link, "aria-current");
  }
}

function configureGeneratedEllipsis(ellipsis: HTMLElement, item: PaginationItem) {
  if (item.type !== "ellipsis") {
    ellipsis.remove();
    return;
  }
  ellipsis.hidden = false;
  setAttributeIfChanged(ellipsis, "aria-hidden", "true");
  setAttributeIfChanged(ellipsis, "data-ellipsis", item.side);
  if (!ellipsis.textContent?.trim()) ellipsis.textContent = "...";
}

function syncGeneratedPages(root: HTMLElement, items: PaginationItem[], currentPage: number) {
  const state = stateFor(root);
  for (const pages of paginationPages(root)) {
    const signature = JSON.stringify(items);
    if (state.lastSignature === signature && pages.childElementCount > 0) continue;
    const template = originalTemplateNodes(state, pages);
    pages.replaceChildren();
    for (const item of items) {
      for (const templateNode of template) {
        const clone = templateNode.cloneNode(true);
        if (clone instanceof HTMLElement) clone.setAttribute("data-pagination-generated", item.type);
        if (clone instanceof Element) {
          clone.querySelectorAll<HTMLElement>("aria-pagination-link").forEach((link) => configureGeneratedLink(link, item, currentPage));
          clone.querySelectorAll<HTMLElement>("aria-pagination-ellipsis").forEach((ellipsis) => configureGeneratedEllipsis(ellipsis, item));
        }
        pages.append(clone);
      }
    }
    state.lastSignature = signature;
  }
}

function syncAllLinks(root: HTMLElement, currentPage: number) {
  for (const link of Array.from(root.querySelectorAll<HTMLElement>("aria-pagination-link"))) {
    const page = positiveInteger(link.getAttribute("data-page") ?? link.getAttribute("page"), 0);
    if (!page) continue;
    if (page === currentPage) setAttributeIfChanged(link, "aria-current", "page");
    else removeAttributeIfPresent(link, "aria-current");
  }
}

function observeRoot(root: HTMLElement) {
  const state = stateFor(root);
  if (state.observer || typeof MutationObserver === "undefined") return;
  state.observer = new MutationObserver(() => {
    if (!state.syncing) syncPaginationTreeFromRoot(root);
  });
  state.observer.observe(root, {
    attributes: true,
    attributeFilter: ["page", "default-page", "total-pages", "max-visible-pages"],
    childList: true,
    subtree: true,
  });
}

export function requestPaginationPage(root: HTMLElement, page: number) {
  const totalPages = paginationTotalPages(root);
  const nextPage = clampPage(page, totalPages);
  const event = new CustomEvent("pagechange", {
    bubbles: true,
    cancelable: true,
    detail: { page: nextPage },
  });
  if (!root.dispatchEvent(event)) return;
  if (!root.hasAttribute("page")) {
    const state = stateFor(root);
    state.page = nextPage;
    syncPaginationTreeFromRoot(root);
  }
}

export function syncPaginationTreeAround(element: HTMLElement) {
  const root = paginationRoot(element);
  if (root instanceof HTMLElement) syncPaginationTreeFromRoot(root);
}

export function syncPaginationTreeFromRoot(root: HTMLElement) {
  const state = stateFor(root);
  if (state.syncing) return;
  state.syncing = true;
  try {
    observeRoot(root);
    const totalPages = paginationTotalPages(root);
    const currentPage = paginationCurrentPage(root);
    const maxVisiblePages = paginationMaxVisiblePages(root);
    const items = paginationWindow(currentPage, totalPages, maxVisiblePages);
    const content = paginationContent(root);
    if (!content) return;

    setAttributeIfChanged(root, "role", "navigation");
    if (!root.hasAttribute("aria-label")) setAttributeIfChanged(root, "aria-label", "pagination");
    setAttributeIfChanged(root, "data-page", String(currentPage));

    setAttributeIfChanged(content, "role", "list");

    syncGeneratedPages(root, items, currentPage);
    syncAllLinks(root, currentPage);
    updateControl(paginationPrevious(root), {
      disabled: currentPage <= 1,
      label: "Go to previous page",
      page: Math.max(1, currentPage - 1),
    });
    updateControl(paginationNext(root), {
      disabled: currentPage >= totalPages,
      label: "Go to next page",
      page: Math.min(totalPages, currentPage + 1),
    });
  } finally {
    state.syncing = false;
  }
}

export function cleanupPaginationRoot(root: HTMLElement) {
  states.get(root)?.observer?.disconnect();
  states.delete(root);
}

export function paginationActionPage(target: HTMLElement) {
  const part = paginationPartName(target);
  if (part === "Previous" || part === "Next" || part === "Link") {
    return positiveInteger(target.getAttribute("data-page") ?? target.getAttribute("page"), 0);
  }
  return 0;
}
