export type AccordionRootElement = HTMLElement & {
  syncAccordionTreeFromRoot: () => void;
};

export function isAccordionRootElement(element: Element | null): element is AccordionRootElement {
  return element instanceof HTMLElement && typeof (element as Partial<AccordionRootElement>).syncAccordionTreeFromRoot === "function";
}

export function accordionRoot(element: Element) {
  return element.closest("aria-accordion");
}

export function accordionItem(element: Element) {
  return element.closest("aria-accordion-item");
}

export function accordionItems(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-accordion-item")).filter((item) => item.closest("aria-accordion") === root);
}

export function accordionElementsInItem(item: Element, root: Element, selector: string) {
  return Array.from(item.querySelectorAll<HTMLElement>(selector)).filter((element) => {
    return element.closest("aria-accordion") === root && element.closest("aria-accordion-item") === item;
  });
}

export function accordionTriggers(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-accordion-trigger, aria-accordion-button")).filter((trigger) => {
    return trigger.closest("aria-accordion") === root && !trigger.hasAttribute("disabled");
  });
}
