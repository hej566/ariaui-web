import {
  accordionElementsInItem,
  accordionItems,
  accordionRoot,
  isAccordionRootElement,
} from "./accordion-dom";
import {
  accordionIdPart,
  accordionItemValue,
  accordionRootValues,
  serializeAccordionValues,
  writeAccordionRootValue,
} from "./accordion-values";

function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

export function setAccordionInheritedDisabled(element: HTMLElement, disabled: boolean) {
  const inheritedAttribute = "data-ariaui-web-inherited-disabled";
  if (disabled) {
    if (!element.hasAttribute("disabled")) {
      element.setAttribute(inheritedAttribute, "");
    }
    element.setAttribute("disabled", "");
    return;
  }

  if (element.hasAttribute(inheritedAttribute)) {
    element.removeAttribute("disabled");
    element.removeAttribute(inheritedAttribute);
  }
}

export function setAccordionDisabledMetadata(element: HTMLElement, disabled: boolean) {
  if (disabled) {
    element.setAttribute("aria-disabled", "true");
    element.setAttribute("data-disabled", "");
  } else {
    element.removeAttribute("aria-disabled");
    element.removeAttribute("data-disabled");
  }
}

export function syncAccordionTreeAround(element: HTMLElement) {
  const root = element.matches("aria-accordion") ? element : accordionRoot(element);
  if (isAccordionRootElement(root)) {
    root.syncAccordionTreeFromRoot();
  }
}

export function syncAccordionTreeFromRoot(root: HTMLElement) {
  const type = root.getAttribute("type") === "multiple" ? "multiple" : "single";
  const orientation = root.getAttribute("orientation") ?? "vertical";
  const rootDisabled = root.hasAttribute("disabled");
  const itemEntries = accordionItems(root).map((item, index) => ({
    item,
    index,
    value: accordionItemValue(item, index),
  }));
  const seenValues = new Set<string>();

  if (itemEntries.length === 0) {
    return;
  }

  for (const { value } of itemEntries) {
    if (seenValues.has(value)) {
      throw new Error("Duplicate Accordion.Item value: " + value);
    }
    seenValues.add(value);
  }

  const activeValues = accordionRootValues(root, type).filter((value) => seenValues.has(value));
  const serializedActiveValues = serializeAccordionValues(type, activeValues);
  if ((root.getAttribute("value") ?? "") !== serializedActiveValues) {
    writeAccordionRootValue(root, type, activeValues);
  }

  const activeValueSet = new Set(activeValues);
  for (const entry of itemEntries) {
    const itemOwnDisabled = entry.item.hasAttribute("disabled") && !entry.item.hasAttribute("data-ariaui-web-inherited-disabled");
    const itemDisabled = rootDisabled || itemOwnDisabled;
    const isOpen = activeValueSet.has(entry.value);
    syncAccordionItem(root, entry.item, entry.value, entry.index, isOpen, itemDisabled, type, orientation);
  }
}

export function syncAccordionItem(root: Element, item: HTMLElement, value: string, index: number, isOpen: boolean, itemDisabled: boolean, type: string, orientation: string) {
  setAccordionInheritedDisabled(item, root.hasAttribute("disabled"));
  setAccordionDisabledMetadata(item, itemDisabled);
  setBooleanAttribute(item, "open", isOpen);
  item.setAttribute("data-state", isOpen ? "open" : "closed");
  item.setAttribute("data-orientation", orientation);

  const headers = accordionElementsInItem(item, root, "aria-accordion-header");
  const triggers = accordionElementsInItem(item, root, "aria-accordion-trigger, aria-accordion-button");
  const contents = accordionElementsInItem(item, root, "aria-accordion-content, aria-accordion-panel");
  const baseId = "ariaui-accordion-" + accordionIdPart(value, index);
  const primaryTrigger = triggers[0];
  const primaryContent = contents[0];

  if (primaryTrigger && !primaryTrigger.id) {
    primaryTrigger.id = baseId + "-trigger";
  }

  if (primaryContent && !primaryContent.id) {
    primaryContent.id = baseId + "-panel";
  }

  for (const header of headers) {
    header.setAttribute("data-state", isOpen ? "open" : "closed");
    header.setAttribute("data-orientation", orientation);
    setAccordionDisabledMetadata(header, itemDisabled);
  }

  for (const trigger of triggers) {
    setAccordionInheritedDisabled(trigger, itemDisabled);
    setBooleanAttribute(trigger, "open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.setAttribute("data-state", isOpen ? "open" : "closed");
    trigger.setAttribute("data-orientation", orientation);
    if (primaryContent) {
      trigger.setAttribute("aria-controls", primaryContent.id);
    }

    const triggerOwnDisabled = trigger.hasAttribute("disabled") && !trigger.hasAttribute("data-ariaui-web-inherited-disabled");
    const triggerDisabled = itemDisabled || triggerOwnDisabled;
    setAccordionDisabledMetadata(trigger, triggerDisabled);
    if (!triggerDisabled && type === "single" && isOpen && root.getAttribute("collapsible") !== "true") {
      trigger.setAttribute("aria-disabled", "true");
    }
  }

  contents.forEach((content, contentIndex) => {
    if (!content.id) {
      content.id = baseId + "-panel-" + contentIndex;
    }
    if (primaryTrigger) {
      content.setAttribute("aria-labelledby", primaryTrigger.id);
    }
    setBooleanAttribute(content, "open", isOpen);
    content.setAttribute("aria-hidden", String(!isOpen));
    content.setAttribute("data-state", isOpen ? "open" : "closed");
    content.setAttribute("data-orientation", orientation);
    content.hidden = !isOpen && !content.hasAttribute("force-mount");
    setAccordionDisabledMetadata(content, itemDisabled);
  });
}

export { setBooleanAttribute as setAccordionBooleanAttribute };
