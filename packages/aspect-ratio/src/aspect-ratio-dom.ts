export function applyAspectRatioShellStyles(element: HTMLElement, ratio: number) {
  element.style.display = "block";
  element.style.position = "relative";
  element.style.width = "100%";
  element.style.paddingBottom = String((1 / ratio) * 100) + "%";
}

export function applyAspectRatioFillStyles(element: HTMLElement) {
  element.style.position = "absolute";
  element.style.inset = "0px";
}

export function firstAspectRatioFillHost(element: HTMLElement, fillElement: HTMLElement | null) {
  return Array.from(element.children).find((child): child is HTMLElement => child instanceof HTMLElement && child !== fillElement) ?? null;
}

export function removeAspectRatioInternalFill(element: HTMLElement, fillElement: HTMLElement | null) {
  if (!fillElement || fillElement.parentElement !== element) {
    return null;
  }

  while (fillElement.firstChild) {
    element.insertBefore(fillElement.firstChild, fillElement);
  }
  fillElement.remove();
  return null;
}

export function ensureAspectRatioInternalFill(element: HTMLElement, fillElement: HTMLElement | null) {
  if (!fillElement || fillElement.parentElement !== element) {
    return element.appendChild(document.createElement("div"));
  }

  return fillElement;
}

export function moveChildrenIntoAspectRatioFill(element: HTMLElement, fillElement: HTMLElement) {
  for (const node of Array.from(element.childNodes)) {
    if (node !== fillElement) {
      fillElement.append(node);
    }
  }
}
