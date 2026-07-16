const PAGINATION_BOUND = "ariauiWebPaginationBound";

type PaginationEvent = CustomEvent<{ page?: number }>;

const observedRoots = new WeakSet<ParentNode>();

function bindControlledPagination(root: HTMLElement) {
  if (root.dataset[PAGINATION_BOUND] === "true") {
    return;
  }

  root.addEventListener("pagechange", (event) => {
    const page = Number((event as PaginationEvent).detail?.page);

    if (Number.isFinite(page) && page > 0) {
      root.setAttribute("page", String(Math.floor(page)));
    }
  });

  root.dataset[PAGINATION_BOUND] = "true";
}

export function syncPaginationExamples(root: ParentNode = document) {
  for (const pagination of Array.from(root.querySelectorAll<HTMLElement>("aria-pagination[data-pagination-controlled]"))) {
    bindControlledPagination(pagination);
  }
}

function observePaginationExamples(root: ParentNode) {
  if (observedRoots.has(root) || typeof MutationObserver === "undefined") {
    return;
  }

  const target = root instanceof Document ? root.documentElement : root;
  if (!(target instanceof Node)) {
    return;
  }

  const observer = new MutationObserver(() => {
    syncPaginationExamples(root);
  });

  observer.observe(target, {
    childList: true,
    subtree: true,
  });

  observedRoots.add(root);
}

export function installPaginationExamples(root: ParentNode = document) {
  syncPaginationExamples(root);
  observePaginationExamples(root);

  if (typeof window !== "undefined") {
    window.requestAnimationFrame(() => {
      syncPaginationExamples(root);
    });
  }
}
