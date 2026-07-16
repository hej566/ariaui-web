export type PaginationRootElement = HTMLElement & {
  syncPaginationTreeFromRoot?: () => void;
};

export type PaginationItem =
  | { type: "page"; page: number }
  | { type: "ellipsis"; side: "start" | "end" };

export function paginationPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function paginationRoot(element: Element) {
  return element.matches("aria-pagination") ? element : element.closest("aria-pagination");
}

export function paginationElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => element.closest("aria-pagination") === root,
  );
}

export function paginationContent(root: Element) {
  return paginationElements(root, "aria-pagination-content")[0] ?? null;
}

export function paginationPages(root: Element) {
  return paginationElements(root, "aria-pagination-pages");
}

export function paginationPrevious(root: Element) {
  return paginationElements(root, "aria-pagination-previous")[0] ?? null;
}

export function paginationNext(root: Element) {
  return paginationElements(root, "aria-pagination-next")[0] ?? null;
}

export function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(1, page), totalPages);
}

export function positiveInteger(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function paginationWindow(currentPage: number, totalPages: number, maxVisiblePages: number): PaginationItem[] {
  const total = Math.max(1, totalPages);
  const max = Math.max(1, maxVisiblePages);
  const current = clampPage(currentPage, total);
  if (total <= max) {
    return Array.from({ length: total }, (_, index) => ({ type: "page", page: index + 1 }) as const);
  }

  const boundaryInnerCount = Math.max(0, max - 2);
  const edgeThreshold = Math.max(1, Math.floor(max / 2));
  const items: PaginationItem[] = [{ type: "page", page: 1 }];

  if (current <= edgeThreshold) {
    for (let page = 2; page <= Math.min(total - 1, boundaryInnerCount + 1); page += 1) {
      items.push({ type: "page", page });
    }
    items.push({ type: "ellipsis", side: "end" }, { type: "page", page: total });
    return items;
  }

  if (current >= total - edgeThreshold + 1) {
    items.push({ type: "ellipsis", side: "start" });
    for (let page = Math.max(2, total - boundaryInnerCount); page <= total - 1; page += 1) {
      items.push({ type: "page", page });
    }
    items.push({ type: "page", page: total });
    return items;
  }

  const middleCount = Math.max(1, max - 3);
  const halfBefore = Math.floor((middleCount - 1) / 2);
  let start = current - halfBefore;
  let end = start + middleCount - 1;
  if (start < 2) {
    start = 2;
    end = start + middleCount - 1;
  }
  if (end > total - 1) {
    end = total - 1;
    start = Math.max(2, end - middleCount + 1);
  }

  items.push({ type: "ellipsis", side: "start" });
  for (let page = start; page <= end; page += 1) {
    items.push({ type: "page", page });
  }
  items.push({ type: "ellipsis", side: "end" }, { type: "page", page: total });
  return items;
}
