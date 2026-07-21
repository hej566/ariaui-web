export function getScrollButtonOffset(viewport: HTMLElement | null) {
  const first = viewport?.firstElementChild;
  if (first instanceof HTMLElement) {
    const rowHeight = first.getBoundingClientRect().height;
    if (rowHeight > 0) return rowHeight * 2;
  }
  return 32;
}

export function anchorSelectedItem(viewport: HTMLElement | null) {
  if (!viewport) return false;
  const selected = viewport.querySelector<HTMLElement>('[aria-selected="true"], [data-state="checked"]');
  if (!selected) return false;

  const viewportRect = viewport.getBoundingClientRect();
  const selectedRect = selected.getBoundingClientRect();
  const viewportHeight = viewport.clientHeight || viewportRect.height;
  if (viewportHeight <= 0 || selectedRect.height <= 0) return false;

  const selectedTop = selectedRect.top - viewportRect.top + viewport.scrollTop;
  const centeredTop = selectedTop - (viewportHeight - selectedRect.height) / 2;
  const maxScrollTop = Math.max(0, viewport.scrollHeight - viewportHeight);
  viewport.scrollTop = Math.min(Math.max(centeredTop, 0), maxScrollTop);
  return true;
}
