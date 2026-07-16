import {
  paginationCurrentPage,
  paginationElementTargetPage,
  paginationPartName,
  paginationRoot,
  paginationTotalPages,
  setPaginationPage,
} from "./pagination-sync";

function isDisabled(element: HTMLElement) {
  return element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true";
}

export function handlePaginationClick(element: HTMLElement, event: Event) {
  if (event.defaultPrevented) {
    return;
  }

  const root = paginationRoot(element);
  if (!root) {
    return;
  }

  const partName = paginationPartName(element);
  if (partName !== "Link" && partName !== "Previous" && partName !== "Next") {
    return;
  }

  if (isDisabled(element)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  const totalPages = paginationTotalPages(root);
  const currentPage = paginationCurrentPage(root);
  const targetPage = partName === "Previous"
    ? currentPage - 1
    : partName === "Next"
      ? currentPage + 1
      : paginationElementTargetPage(element, totalPages);

  if (targetPage == null) {
    return;
  }

  event.preventDefault();
  setPaginationPage(root, targetPage);
}
