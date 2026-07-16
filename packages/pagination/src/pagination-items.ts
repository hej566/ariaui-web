export type PaginationPageItem = {
  readonly type: "page";
  readonly page: number;
  readonly isCurrent: boolean;
};

export type PaginationEllipsisItem = {
  readonly type: "ellipsis";
  readonly key: "start-ellipsis" | "end-ellipsis";
};

export type PaginationItem = PaginationPageItem | PaginationEllipsisItem;

export function normalizePositiveInteger(value: number | string | null | undefined, fallback: number) {
  if (value == null || value === "") {
    return fallback;
  }

  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return Math.max(1, Math.floor(numberValue));
}

export function clampPage(page: number | string | null | undefined, totalPages: number) {
  return Math.min(Math.max(1, Math.floor(normalizePositiveInteger(page, 1))), totalPages);
}

export function getPaginationItems(page: number, totalPages: number, maxVisiblePages: number): PaginationItem[] {
  const visiblePageCount = Math.min(Math.max(3, maxVisiblePages), totalPages);
  const items: PaginationItem[] = [];

  if (totalPages <= visiblePageCount) {
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
      items.push({
        type: "page",
        page: pageNumber,
        isCurrent: pageNumber === page,
      });
    }

    return items;
  }

  const middlePageCount = visiblePageCount - 2;
  let startPage: number;
  let endPage: number;

  if (page <= middlePageCount) {
    startPage = 2;
    endPage = middlePageCount + 1;
  } else if (page >= totalPages - middlePageCount + 2) {
    startPage = totalPages - middlePageCount;
    endPage = totalPages - 1;
  } else {
    const twoSidedMiddlePageCount = Math.max(1, middlePageCount - 1);

    startPage = page - Math.floor(twoSidedMiddlePageCount / 2);
    endPage = startPage + twoSidedMiddlePageCount - 1;
  }

  items.push({ type: "page", page: 1, isCurrent: page === 1 });

  if (startPage > 2) {
    items.push({ type: "ellipsis", key: "start-ellipsis" });
  }

  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) {
    items.push({
      type: "page",
      page: pageNumber,
      isCurrent: pageNumber === page,
    });
  }

  if (endPage < totalPages - 1) {
    items.push({ type: "ellipsis", key: "end-ellipsis" });
  }

  items.push({
    type: "page",
    page: totalPages,
    isCurrent: page === totalPages,
  });

  return items;
}
