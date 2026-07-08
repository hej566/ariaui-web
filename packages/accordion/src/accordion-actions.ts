import {
  accordionItem,
  accordionItems,
  isAccordionRootElement,
} from "./accordion-dom";
import {
  accordionItemValue,
  accordionRootValues,
  accordionValuesEqual,
  uniqueAccordionValues,
  writeAccordionRootValue,
} from "./accordion-values";

export function toggleAccordionItem(trigger: HTMLElement, root: Element) {
  const item = accordionItem(trigger);
  if (!item || item.closest("aria-accordion") !== root) {
    return false;
  }

  const type = root.getAttribute("type") === "multiple" ? "multiple" : "single";
  const itemIndex = accordionItems(root).indexOf(item as HTMLElement);
  const itemValue = accordionItemValue(item, itemIndex);
  const activeValues = accordionRootValues(root, type);
  const isOpen = activeValues.includes(itemValue);
  let nextValues: string[];

  if (type === "multiple") {
    nextValues = isOpen ? activeValues.filter((value) => value !== itemValue) : [...activeValues, itemValue];
  } else if (isOpen && root.getAttribute("collapsible") !== "true") {
    nextValues = activeValues;
  } else {
    nextValues = isOpen ? [] : [itemValue];
  }

  nextValues = uniqueAccordionValues(nextValues);
  if (accordionValuesEqual(activeValues, nextValues)) {
    if (isAccordionRootElement(root)) {
      root.syncAccordionTreeFromRoot();
    }
    return true;
  }

  writeAccordionRootValue(root, type, nextValues);
  if (isAccordionRootElement(root)) {
    root.syncAccordionTreeFromRoot();
  }
  root.dispatchEvent(new CustomEvent("valuechange", {
    bubbles: true,
    detail: {
      value: type === "multiple" ? nextValues : nextValues[0] ?? "",
      values: nextValues,
    },
  }));
  return true;
}

export function nextAccordionOpenState(trigger: Element, root: Element | null) {
  if (!root || root.getAttribute("type") !== "single") {
    return !trigger.hasAttribute("open");
  }

  if (trigger.hasAttribute("open") && root.getAttribute("collapsible") !== "true") {
    return true;
  }

  return !trigger.hasAttribute("open");
}

export function closeAccordionSiblings(trigger: HTMLElement, root: Element, controlledElement: Element) {
  for (const siblingTrigger of root.querySelectorAll<HTMLElement>("aria-accordion-trigger, aria-accordion-button")) {
    if (siblingTrigger === trigger) {
      continue;
    }

    siblingTrigger.removeAttribute("open");
    const controlledId = siblingTrigger.getAttribute("aria-controls");
    const siblingPanel = controlledId ? trigger.ownerDocument.getElementById(controlledId) : null;

    if (siblingPanel && siblingPanel !== controlledElement) {
      siblingPanel.removeAttribute("open");
      siblingPanel.hidden = true;
    }
  }
}
