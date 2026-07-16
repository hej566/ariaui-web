import { clampPage, getPaginationItems, normalizePositiveInteger, type PaginationItem } from "./pagination-items";

type PaginationRootState = {
  defaultPageApplied: boolean;
  page: number | null;
  syncing: boolean;
};

type LinkClassState = {
  baseClassName: string;
};

const rootStates = new WeakMap<HTMLElement, PaginationRootState>();
const pagesTemplates = new WeakMap<HTMLElement, readonly Node[]>();
const linkClassStates = new WeakMap<HTMLElement, LinkClassState>();

function paginationRootState(root: HTMLElement) {
  let state = rootStates.get(root);

  if (!state) {
    state = {
      defaultPageApplied: false,
      page: null,
      syncing: false,
    };
    rootStates.set(root, state);
  }

  return state;
}

function readAttribute(element: Element, names: readonly string[]) {
  for (const name of names) {
    if (element.hasAttribute(name)) {
      return element.getAttribute(name);
    }
  }

  return null;
}

function hasAttribute(element: Element, names: readonly string[]) {
  return names.some((name) => element.hasAttribute(name));
}

function rootNumber(root: Element, names: readonly string[], fallback: number) {
  return normalizePositiveInteger(readAttribute(root, names), fallback);
}

export function paginationPartName(element: Element) {
  return element.getAttribute("data-part") ?? "";
}

export function paginationRoot(element: Element) {
  const root = element.matches("aria-pagination") ? element : element.closest("aria-pagination");
  return root instanceof HTMLElement ? root : null;
}

export function paginationTotalPages(root: Element) {
  return rootNumber(root, ["total-pages", "totalpages"], 1);
}

export function paginationMaxVisiblePages(root: Element) {
  return rootNumber(root, ["max-visible-pages", "maxvisiblepages"], 5);
}

function paginationDefaultPage(root: Element, totalPages: number) {
  return clampPage(readAttribute(root, ["default-page", "defaultpage"]) ?? 1, totalPages);
}

export function isPaginationControlled(root: Element) {
  return hasAttribute(root, ["page"]);
}

export function paginationCurrentPage(root: HTMLElement) {
  const totalPages = paginationTotalPages(root);
  const state = paginationRootState(root);

  if (isPaginationControlled(root)) {
    return clampPage(root.getAttribute("page"), totalPages);
  }

  if (!state.defaultPageApplied || state.page == null) {
    state.page = paginationDefaultPage(root, totalPages);
    state.defaultPageApplied = true;
  }

  state.page = clampPage(state.page, totalPages);
  return state.page;
}

export function dispatchPaginationPageChange(root: HTMLElement, page: number) {
  root.dispatchEvent(new CustomEvent("pagechange", {
    bubbles: true,
    detail: { page },
  }));
}

export function setPaginationPage(root: HTMLElement, nextPage: number) {
  const totalPages = paginationTotalPages(root);
  const currentPage = paginationCurrentPage(root);
  const targetPage = clampPage(nextPage, totalPages);

  if (targetPage === currentPage) {
    return false;
  }

  if (!isPaginationControlled(root)) {
    paginationRootState(root).page = targetPage;
    syncPaginationTreeFromRoot(root);
  }

  dispatchPaginationPageChange(root, targetPage);
  return true;
}

function ownPaginationElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-pagination") === root);
}

function selfAndDescendants(node: Node, selector: string) {
  const elements: HTMLElement[] = [];

  if (node instanceof HTMLElement && node.matches(selector)) {
    elements.push(node);
  }

  if (node instanceof Element) {
    elements.push(...Array.from(node.querySelectorAll<HTMLElement>(selector)));
  }

  return elements;
}

function hasExplicitPage(element: Element) {
  return hasAttribute(element, ["page"]);
}

export function paginationElementTargetPage(element: Element, totalPages = paginationRoot(element) ? paginationTotalPages(paginationRoot(element)!) : 1) {
  if (!hasExplicitPage(element) && !element.hasAttribute("data-page")) {
    return null;
  }

  return clampPage(readAttribute(element, ["page"]) ?? element.getAttribute("data-page"), totalPages);
}

function syncActiveClass(link: HTMLElement, active: boolean) {
  let state = linkClassStates.get(link);

  if (!state) {
    state = {
      baseClassName: link.getAttribute("class") ?? "",
    };
    linkClassStates.set(link, state);
  }

  const activeClassName = readAttribute(link, ["active-class", "active-class-name", "activeclassname"]);
  if (active && activeClassName) {
    link.setAttribute("class", activeClassName);
    return;
  }

  if (state.baseClassName) {
    link.setAttribute("class", state.baseClassName);
  } else {
    link.removeAttribute("class");
  }
}

function syncPageLink(link: HTMLElement, page: number, currentPage: number, totalPages: number) {
  const targetPage = clampPage(page, totalPages);
  const isActive = targetPage === currentPage || link.hasAttribute("is-active") || link.hasAttribute("isactive");

  link.setAttribute("page", String(targetPage));
  link.dataset.page = String(targetPage);

  if (!link.hasAttribute("role")) {
    link.setAttribute("role", "link");
  }

  if (!link.hasAttribute("tabindex") || link.getAttribute("tabindex") === "0" || link.getAttribute("tabindex") === "-1") {
    link.setAttribute("tabindex", "0");
  }

  if (isActive) {
    link.setAttribute("aria-current", "page");
    link.dataset.current = "page";
  } else {
    link.removeAttribute("aria-current");
    delete link.dataset.current;
  }

  syncActiveClass(link, isActive);
}

function syncEllipsis(ellipsis: HTMLElement, item: Extract<PaginationItem, { type: "ellipsis" }>) {
  ellipsis.setAttribute("aria-hidden", "true");
  ellipsis.dataset.paginationItemType = "ellipsis";
  ellipsis.dataset.paginationEllipsis = item.key;

  if (!ellipsis.textContent?.trim()) {
    ellipsis.textContent = "...";
  }
}

function decorateGeneratedNode(node: Node, item: PaginationItem, currentPage: number, totalPages: number) {
  if (node instanceof HTMLElement) {
    node.dataset.paginationItemType = item.type;

    if (item.type === "page") {
      node.dataset.page = String(item.page);
      delete node.dataset.paginationEllipsis;
    } else {
      delete node.dataset.page;
      node.dataset.paginationEllipsis = item.key;
    }
  }

  if (item.type === "ellipsis" && node instanceof HTMLElement && node.matches("aria-pagination-link") && !hasExplicitPage(node)) {
    return null;
  }

  if (item.type === "page" && node instanceof HTMLElement && node.matches("aria-pagination-ellipsis")) {
    return null;
  }

  for (const link of selfAndDescendants(node, "aria-pagination-link")) {
    if (item.type === "ellipsis" && !hasExplicitPage(link)) {
      link.remove();
      continue;
    }

    if (item.type === "page" && !hasExplicitPage(link)) {
      if (!link.textContent?.trim()) {
        link.textContent = String(item.page);
      }

      syncPageLink(link, item.page, currentPage, totalPages);
    }
  }

  for (const ellipsis of selfAndDescendants(node, "aria-pagination-ellipsis")) {
    if (item.type === "page") {
      ellipsis.remove();
      continue;
    }

    syncEllipsis(ellipsis, item);
  }

  return node;
}

function syncGeneratedPages(root: HTMLElement, items: readonly PaginationItem[], currentPage: number, totalPages: number) {
  for (const pages of ownPaginationElements(root, "aria-pagination-pages")) {
    let templates = pagesTemplates.get(pages);

    if (!templates) {
      templates = Array.from(pages.childNodes).map((child) => child.cloneNode(true));
      pagesTemplates.set(pages, templates);
    }

    const fragment = root.ownerDocument.createDocumentFragment();

    for (const item of items) {
      for (const template of templates) {
        const rendered = decorateGeneratedNode(template.cloneNode(true), item, currentPage, totalPages);

        if (rendered) {
          fragment.append(rendered);
        }
      }
    }

    pages.replaceChildren(fragment);
    pages.dataset.paginationRendered = "true";
  }
}

function syncStandaloneLinks(root: HTMLElement, currentPage: number, totalPages: number) {
  for (const link of ownPaginationElements(root, "aria-pagination-link")) {
    const targetPage = paginationElementTargetPage(link, totalPages);

    if (targetPage == null) {
      if (link.hasAttribute("is-active") || link.hasAttribute("isactive")) {
        link.setAttribute("aria-current", "page");
        syncActiveClass(link, true);
      }
      continue;
    }

    syncPageLink(link, targetPage, currentPage, totalPages);
  }
}

function syncBoundaryControl(control: HTMLElement, disabled: boolean) {
  if (!control.hasAttribute("role")) {
    control.setAttribute("role", "link");
  }

  if (disabled) {
    control.setAttribute("aria-disabled", "true");
    control.setAttribute("data-disabled", "");
    control.setAttribute("tabindex", "-1");
  } else {
    control.removeAttribute("aria-disabled");
    control.removeAttribute("data-disabled");
    if (!control.hasAttribute("tabindex") || control.getAttribute("tabindex") === "-1") {
      control.setAttribute("tabindex", "0");
    }
  }
}

function syncPreviousNext(root: HTMLElement, currentPage: number, totalPages: number) {
  for (const previous of ownPaginationElements(root, "aria-pagination-previous")) {
    if (!previous.hasAttribute("aria-label")) {
      previous.setAttribute("aria-label", "Go to previous page");
    }

    previous.dataset.page = String(Math.max(1, currentPage - 1));
    syncBoundaryControl(previous, currentPage <= 1);
  }

  for (const next of ownPaginationElements(root, "aria-pagination-next")) {
    if (!next.hasAttribute("aria-label")) {
      next.setAttribute("aria-label", "Go to next page");
    }

    next.dataset.page = String(Math.min(totalPages, currentPage + 1));
    syncBoundaryControl(next, currentPage >= totalPages);
  }
}

export function syncPaginationTreeAround(element: Element) {
  const root = paginationRoot(element);
  if (!root) {
    return;
  }

  syncPaginationTreeFromRoot(root);
}

export function syncPaginationTreeFromRoot(root: HTMLElement) {
  const state = paginationRootState(root);
  if (state.syncing) {
    return;
  }

  state.syncing = true;

  try {
    const totalPages = paginationTotalPages(root);
    const maxVisiblePages = paginationMaxVisiblePages(root);
    const currentPage = paginationCurrentPage(root);
    const items = getPaginationItems(currentPage, totalPages, maxVisiblePages);

    root.dataset.page = String(currentPage);
    root.dataset.totalPages = String(totalPages);
    root.dataset.maxVisiblePages = String(maxVisiblePages);

    syncGeneratedPages(root, items, currentPage, totalPages);
    syncStandaloneLinks(root, currentPage, totalPages);
    syncPreviousNext(root, currentPage, totalPages);
  } finally {
    state.syncing = false;
  }
}
