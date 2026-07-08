export type AlertRootElement = HTMLElement & {
  syncAlertTreeFromRoot: () => void;
};

export function isAlertRootElement(element: Element | null): element is AlertRootElement {
  return element instanceof HTMLElement
    && typeof (element as Partial<AlertRootElement>).syncAlertTreeFromRoot === "function";
}

export function alertRoot(element: Element) {
  return element.closest("aria-alert");
}

export function alertElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-alert") === root);
}

export function alertCompositionHost(part: HTMLElement) {
  if (!part.hasAttribute("native-composition")) {
    return part;
  }

  const child = Array.from(part.children).find((element): element is HTMLElement => element instanceof HTMLElement);
  return child ?? part;
}

export function syncAlertCompositionHost(part: HTMLElement) {
  const host = alertCompositionHost(part);
  if (host === part) {
    return host;
  }

  const className = part.getAttribute("class");
  if (className) {
    for (const token of className.split(/\s+/)) {
      if (token) {
        host.classList.add(token);
      }
    }
  }

  const style = part.getAttribute("style");
  if (style && !host.getAttribute("style")) {
    host.setAttribute("style", style);
  }

  for (const attribute of Array.from(part.attributes)) {
    const name = attribute.name;
    if (name === "class" || name === "style" || name === "native-composition") {
      continue;
    }

    if (name.startsWith("aria-") || name.startsWith("data-") || ["id", "part", "role", "tabindex", "title", "type", "value", "name", "disabled"].includes(name)) {
      host.setAttribute(name, attribute.value);
    }
  }

  host.removeAttribute("native-composition");
  return host;
}
