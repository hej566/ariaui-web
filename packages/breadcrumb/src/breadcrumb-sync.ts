import {
  breadcrumbPartName,
  createBreadcrumbChevronIcon,
  createBreadcrumbEllipsisIcon,
  createBreadcrumbEllipsisLabel,
  hasBreadcrumbAuthoredContent,
} from "./breadcrumb-dom";

export function syncBreadcrumbPart(element: HTMLElement) {
  const partName = breadcrumbPartName(element);

  if (partName === "Page") {
    syncBreadcrumbPage(element);
    return;
  }

  if (partName === "Separator") {
    syncBreadcrumbSeparator(element);
    return;
  }

  if (partName === "Ellipsis") {
    syncBreadcrumbEllipsis(element);
  }
}

function syncBreadcrumbPage(page: HTMLElement) {
  if (!page.hasAttribute("role")) {
    page.setAttribute("role", "link");
  }

  if (!page.hasAttribute("aria-disabled")) {
    page.setAttribute("aria-disabled", "true");
  }

  if (!page.hasAttribute("aria-current")) {
    page.setAttribute("aria-current", "page");
  }
}

export function syncBreadcrumbSeparator(separator: HTMLElement) {
  if (!separator.hasAttribute("role")) {
    separator.setAttribute("role", "presentation");
  }

  if (!separator.hasAttribute("aria-hidden")) {
    separator.setAttribute("aria-hidden", "true");
  }

  if (hasBreadcrumbAuthoredContent(separator)) {
    separator.querySelector("[data-breadcrumb-generated='separator-icon']")?.remove();
    return;
  }

  if (!separator.querySelector("[data-breadcrumb-generated='separator-icon']")) {
    separator.append(createBreadcrumbChevronIcon());
  }
}

export function syncBreadcrumbEllipsis(ellipsis: HTMLElement) {
  if (!ellipsis.hasAttribute("role")) {
    ellipsis.setAttribute("role", "presentation");
  }

  if (!ellipsis.hasAttribute("aria-hidden")) {
    ellipsis.setAttribute("aria-hidden", "true");
  }

  if (hasBreadcrumbAuthoredContent(ellipsis)) {
    return;
  }

  if (!ellipsis.querySelector("[data-breadcrumb-generated='ellipsis-icon']")) {
    ellipsis.append(createBreadcrumbEllipsisIcon());
  }

  if (!ellipsis.querySelector("[data-breadcrumb-generated='ellipsis-label']")) {
    ellipsis.append(createBreadcrumbEllipsisLabel());
  }
}
