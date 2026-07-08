import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

export class AccordionElement extends AriaWebElement {
  #accordionSyncing = false;

  accordionPartName() {
    const constructor = this.constructor as typeof AccordionElement;
    return constructor.partName;
  }

  isAccordionDisclosureTrigger(role: string | null) {
    return role === "button" && (this.accordionPartName() === "Trigger" || this.accordionPartName() === "Button");
  }

  accordionRoot() {
    return this.closest("aria-accordion");
  }

  accordionItem() {
    return this.closest("aria-accordion-item");
  }

  accordionItems(root: Element) {
    return Array.from(root.querySelectorAll<HTMLElement>("aria-accordion-item")).filter((item) => item.closest("aria-accordion") === root);
  }

  accordionElementsInItem(item: Element, root: Element, selector: string) {
    return Array.from(item.querySelectorAll<HTMLElement>(selector)).filter((element) => {
      return element.closest("aria-accordion") === root && element.closest("aria-accordion-item") === item;
    });
  }

  accordionTriggers(root: Element) {
    return Array.from(root.querySelectorAll<HTMLElement>("aria-accordion-trigger, aria-accordion-button")).filter((trigger) => {
      return trigger.closest("aria-accordion") === root && !trigger.hasAttribute("disabled");
    });
  }

  accordionValuesFromAttribute(value: string | null, type: string) {
    if (value == null) {
      return [];
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item));
        }
      } catch {
        return [];
      }
    }

    if (type === "multiple") {
      return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
    }

    return [trimmed];
  }

  uniqueAccordionValues(values: readonly string[]) {
    return Array.from(new Set(values));
  }

  accordionValuesEqual(first: readonly string[], second: readonly string[]) {
    return first.length === second.length && first.every((value, index) => value === second[index]);
  }

  serializeAccordionValues(type: string, values: readonly string[]) {
    return type === "multiple" ? values.join(",") : values[0] ?? "";
  }

  writeAccordionRootValue(root: Element, type: string, values: readonly string[]) {
    const serialized = this.serializeAccordionValues(type, this.uniqueAccordionValues(values));
    if (root.getAttribute("value") !== serialized) {
      root.setAttribute("value", serialized);
    }
  }

  accordionRootValues(root: Element, type: string) {
    if (!root.hasAttribute("value")) {
      const defaultValue = root.getAttribute("default-value") ?? root.getAttribute("defaultvalue");
      if (defaultValue != null) {
        this.writeAccordionRootValue(root, type, this.accordionValuesFromAttribute(defaultValue, type));
      }
    }

    return this.uniqueAccordionValues(this.accordionValuesFromAttribute(root.getAttribute("value"), type));
  }

  accordionItemValue(item: Element, index = 0) {
    return item.getAttribute("value") ?? String(index);
  }

  accordionIdPart(value: string, index: number) {
    const normalized = value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
    return normalized || String(index);
  }

  setAccordionInheritedDisabled(element: HTMLElement, disabled: boolean) {
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

  setAccordionDisabledMetadata(element: HTMLElement, disabled: boolean) {
    if (disabled) {
      element.setAttribute("aria-disabled", "true");
      element.setAttribute("data-disabled", "");
    } else {
      element.removeAttribute("aria-disabled");
      element.removeAttribute("data-disabled");
    }
  }

  override afterAriaWebContractApplied() {
    this.syncAccordionTreeAroundSelf();
  }

  syncAccordionTreeAroundSelf() {
    const root = this.accordionPartName() === "Root" ? this : this.accordionRoot();
    if (root instanceof AccordionElement) {
      root.syncAccordionTreeFromRoot();
    }
  }

  syncAccordionTreeFromRoot() {
    if (this.accordionPartName() !== "Root" || this.#accordionSyncing) {
      return;
    }

    this.#accordionSyncing = true;
    try {
      const root = this;
      const type = root.getAttribute("type") === "multiple" ? "multiple" : "single";
      const orientation = root.getAttribute("orientation") ?? "vertical";
      const rootDisabled = root.hasAttribute("disabled");
      const itemEntries = this.accordionItems(root).map((item, index) => ({
        item,
        index,
        value: this.accordionItemValue(item, index),
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

      const activeValues = this.accordionRootValues(root, type).filter((value) => seenValues.has(value));
      const serializedActiveValues = this.serializeAccordionValues(type, activeValues);
      if ((root.getAttribute("value") ?? "") !== serializedActiveValues) {
        this.writeAccordionRootValue(root, type, activeValues);
      }

      const activeValueSet = new Set(activeValues);
      for (const entry of itemEntries) {
        const itemOwnDisabled = entry.item.hasAttribute("disabled") && !entry.item.hasAttribute("data-ariaui-web-inherited-disabled");
        const itemDisabled = rootDisabled || itemOwnDisabled;
        const isOpen = activeValueSet.has(entry.value);
        this.syncAccordionItem(root, entry.item, entry.value, entry.index, isOpen, itemDisabled, type, orientation);
      }
    } finally {
      this.#accordionSyncing = false;
    }
  }

  syncAccordionItem(root: Element, item: HTMLElement, value: string, index: number, isOpen: boolean, itemDisabled: boolean, type: string, orientation: string) {
    this.setAccordionInheritedDisabled(item, root.hasAttribute("disabled"));
    this.setAccordionDisabledMetadata(item, itemDisabled);
    setBooleanAttribute(item, "open", isOpen);
    item.setAttribute("data-state", isOpen ? "open" : "closed");
    item.setAttribute("data-orientation", orientation);

    const headers = this.accordionElementsInItem(item, root, "aria-accordion-header");
    const triggers = this.accordionElementsInItem(item, root, "aria-accordion-trigger, aria-accordion-button");
    const contents = this.accordionElementsInItem(item, root, "aria-accordion-content, aria-accordion-panel");
    const baseId = "ariaui-accordion-" + this.accordionIdPart(value, index);
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
      this.setAccordionDisabledMetadata(header, itemDisabled);
    }

    for (const trigger of triggers) {
      this.setAccordionInheritedDisabled(trigger, itemDisabled);
      setBooleanAttribute(trigger, "open", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
      trigger.setAttribute("data-state", isOpen ? "open" : "closed");
      trigger.setAttribute("data-orientation", orientation);
      if (primaryContent) {
        trigger.setAttribute("aria-controls", primaryContent.id);
      }

      const triggerOwnDisabled = trigger.hasAttribute("disabled") && !trigger.hasAttribute("data-ariaui-web-inherited-disabled");
      const triggerDisabled = itemDisabled || triggerOwnDisabled;
      this.setAccordionDisabledMetadata(trigger, triggerDisabled);
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
      this.setAccordionDisabledMetadata(content, itemDisabled);
    });
  }

  toggleAccordionItem(root: Element) {
    const item = this.accordionItem();
    if (!item || item.closest("aria-accordion") !== root) {
      return false;
    }

    const type = root.getAttribute("type") === "multiple" ? "multiple" : "single";
    const itemIndex = this.accordionItems(root).indexOf(item as HTMLElement);
    const itemValue = this.accordionItemValue(item, itemIndex);
    const activeValues = this.accordionRootValues(root, type);
    const isOpen = activeValues.includes(itemValue);
    let nextValues: string[];

    if (type === "multiple") {
      nextValues = isOpen ? activeValues.filter((value) => value !== itemValue) : [...activeValues, itemValue];
    } else if (isOpen && root.getAttribute("collapsible") !== "true") {
      nextValues = activeValues;
    } else {
      nextValues = isOpen ? [] : [itemValue];
    }

    nextValues = this.uniqueAccordionValues(nextValues);
    if (this.accordionValuesEqual(activeValues, nextValues)) {
      if (root instanceof AccordionElement) {
        root.syncAccordionTreeFromRoot();
      }
      return true;
    }

    this.writeAccordionRootValue(root, type, nextValues);
    if (root instanceof AccordionElement) {
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

  nextAccordionOpenState(root: Element | null) {
    if (!root || root.getAttribute("type") !== "single") {
      return !this.hasAttribute("open");
    }

    if (this.hasAttribute("open") && root.getAttribute("collapsible") !== "true") {
      return true;
    }

    return !this.hasAttribute("open");
  }

  closeAccordionSiblings(root: Element, controlledElement: Element) {
    for (const trigger of root.querySelectorAll<HTMLElement>("aria-accordion-trigger, aria-accordion-button")) {
      if (trigger === this) {
        continue;
      }

      trigger.removeAttribute("open");
      const controlledId = trigger.getAttribute("aria-controls");
      const siblingPanel = controlledId ? this.ownerDocument.getElementById(controlledId) : null;

      if (siblingPanel && siblingPanel !== controlledElement) {
        siblingPanel.removeAttribute("open");
        siblingPanel.hidden = true;
      }
    }
  }

  override handleCompositeRovingFocus(event: KeyboardEvent, role: string | null) {
    if (!this.isAccordionDisclosureTrigger(role)) {
      return false;
    }

    const root = this.accordionRoot();
    if (!root) {
      return false;
    }

    const triggers = this.accordionTriggers(root);
    const currentIndex = triggers.indexOf(this);
    if (currentIndex === -1 || triggers.length === 0) {
      return false;
    }

    const orientation = root.getAttribute("orientation") ?? "vertical";
    const dir = root.getAttribute("dir") ?? "ltr";
    let nextIndex = -1;

    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = triggers.length - 1;
    } else if (orientation === "vertical" && event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % triggers.length;
    } else if (orientation === "vertical" && event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    } else if (orientation === "horizontal" && event.key === (dir === "rtl" ? "ArrowLeft" : "ArrowRight")) {
      nextIndex = (currentIndex + 1) % triggers.length;
    } else if (orientation === "horizontal" && event.key === (dir === "rtl" ? "ArrowRight" : "ArrowLeft")) {
      nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    }

    if (nextIndex === -1) {
      return false;
    }

    event.preventDefault();
    triggers[nextIndex]?.focus();
    return true;
  }

  override toggleControlledElement() {
    const role = this.getAttribute("role");
    const root = this.isAccordionDisclosureTrigger(role) ? this.accordionRoot() : null;
    if (root && this.accordionItem()) {
      return this.toggleAccordionItem(root);
    }

    const controlledElement = this.controlledElement();
    if (!controlledElement) {
      return false;
    }

    const nextOpen = this.isAccordionDisclosureTrigger(role) ? this.nextAccordionOpenState(root) : !this.hasAttribute("open");
    if (root && root.getAttribute("type") === "single" && nextOpen) {
      this.closeAccordionSiblings(root, controlledElement);
    }
    this.open = nextOpen;
    setBooleanAttribute(controlledElement, "open", nextOpen);
    controlledElement.hidden = !nextOpen;
    return true;
  }
}

export function createAccordionWebComponent(part: WebComponentPartSpec): typeof AccordionElement {
  return class extends AccordionElement {
    static override packageSlug = "accordion";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
