const datepickerContentRoots = new WeakMap<Element, HTMLElement>();
const datepickerRootContents = new WeakMap<Element, HTMLElement>();

export function datepickerRoot(element: Element | null) {
  const localRoot = element?.closest("aria-datepicker");
  if (localRoot) {
    return localRoot as HTMLElement;
  }

  const content = element?.matches("aria-datepicker-content")
    ? element
    : element?.closest("aria-datepicker-content");
  return content ? datepickerContentRoots.get(content) ?? null : null;
}

export function datepickerElements(root: Element, selector: string) {
  const elements = new Set(root.querySelectorAll<HTMLElement>(selector));
  const content = datepickerRootContents.get(root);
  if (content && !root.contains(content)) {
    for (const element of content.querySelectorAll<HTMLElement>(selector)) {
      elements.add(element);
    }
  }

  return Array.from(elements).filter((element) => datepickerRoot(element) === root);
}

export function datepickerContent(root: Element) {
  return datepickerRootContents.get(root)
    ?? Array.from(root.querySelectorAll<HTMLElement>("aria-datepicker-content"))
      .find((element) => element.closest("aria-datepicker") === root)
    ?? null;
}

export function registerDatepickerContent(root: HTMLElement, content: HTMLElement) {
  datepickerRootContents.set(root, content);
  datepickerContentRoots.set(content, root);
}

export function datepickerRootOwnsNode(root: HTMLElement, node: Node) {
  return root.contains(node) || Boolean(datepickerRootContents.get(root)?.contains(node));
}
