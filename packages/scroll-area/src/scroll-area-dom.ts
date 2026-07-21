export function scrollAreaPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function scrollAreaRoot(element: HTMLElement) {
  return element.matches("aria-scroll-area")
    ? element
    : element.closest<HTMLElement>("aria-scroll-area");
}

export function scrollAreaViewport(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-scroll-area-viewport"))
    .find((viewport) => scrollAreaRoot(viewport) === root) ?? null;
}

export function scrollAreaViewportHost(viewport: HTMLElement) {
  if (viewport.hasAttribute("native-composition") && viewport.firstElementChild instanceof HTMLElement) {
    return viewport.firstElementChild;
  }
  return viewport;
}

export function scrollAreaScrollbars(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-scroll-area-scrollbar"))
    .filter((scrollbar) => scrollAreaRoot(scrollbar) === root);
}

export function scrollAreaThumbs(scrollbar: HTMLElement) {
  return Array.from(scrollbar.querySelectorAll<HTMLElement>("aria-scroll-area-thumb"))
    .filter((thumb) => thumb.closest("aria-scroll-area-scrollbar") === scrollbar);
}
