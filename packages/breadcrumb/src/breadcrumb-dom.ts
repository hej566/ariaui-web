const svgNamespace = "http://www.w3.org/2000/svg";

function setSvgAttributes(element: SVGElement, attributes: Readonly<Record<string, string>>) {
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
}

export function breadcrumbPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function createBreadcrumbChevronIcon() {
  const svg = document.createElementNS(svgNamespace, "svg");
  const path = document.createElementNS(svgNamespace, "path");
  setSvgAttributes(svg, {
    "aria-hidden": "true",
    "data-breadcrumb-generated": "separator-icon",
    "fill": "none",
    "height": "16",
    "stroke": "currentColor",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "2",
    "viewBox": "0 0 24 24",
    "width": "16",
  });
  path.setAttribute("d", "m9 18 6-6-6-6");
  svg.append(path);
  return svg;
}

export function createBreadcrumbEllipsisIcon() {
  const svg = document.createElementNS(svgNamespace, "svg");
  setSvgAttributes(svg, {
    "aria-hidden": "true",
    "data-breadcrumb-generated": "ellipsis-icon",
    "fill": "none",
    "height": "16",
    "stroke": "currentColor",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "2",
    "viewBox": "0 0 24 24",
    "width": "16",
  });

  for (const cx of ["12", "19", "5"]) {
    const circle = document.createElementNS(svgNamespace, "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "1");
    svg.append(circle);
  }

  return svg;
}

export function createBreadcrumbEllipsisLabel() {
  const label = document.createElement("span");
  label.className = "sr-only";
  label.dataset.breadcrumbGenerated = "ellipsis-label";
  label.textContent = "More";
  return label;
}

export function hasBreadcrumbAuthoredContent(element: HTMLElement) {
  return Array.from(element.childNodes).some((node) => {
    return !(node instanceof Element && node.hasAttribute("data-breadcrumb-generated"));
  });
}
