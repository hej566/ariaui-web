import { AccordionElement } from "../accordion-element";
import {
  accordionItem,
  accordionRoot,
  accordionTriggers,
} from "../accordion-dom";
import {
  closeAccordionSiblings,
  nextAccordionOpenState,
  toggleAccordionItem,
} from "../accordion-actions";
import { setAccordionBooleanAttribute } from "../accordion-sync";
import { getAccordionPartSpec } from "./part-spec";

const partSpec = getAccordionPartSpec("Trigger");

export class AccordionTriggerElement extends AccordionElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;

  isAccordionDisclosureTrigger(role: string | null) {
    return role === "button";
  }

  override handleCompositeRovingFocus(event: KeyboardEvent, role: string | null) {
    if (!this.isAccordionDisclosureTrigger(role)) {
      return false;
    }

    const root = accordionRoot(this);
    if (!root) {
      return false;
    }

    const triggers = accordionTriggers(root);
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
    const root = this.isAccordionDisclosureTrigger(role) ? accordionRoot(this) : null;
    if (root && accordionItem(this)) {
      return toggleAccordionItem(this, root);
    }

    const controlledElement = this.controlledElement();
    if (!controlledElement) {
      return false;
    }

    const nextOpen = this.isAccordionDisclosureTrigger(role) ? nextAccordionOpenState(this, root) : !this.hasAttribute("open");
    if (root && root.getAttribute("type") === "single" && nextOpen) {
      closeAccordionSiblings(this, root, controlledElement);
    }
    this.open = nextOpen;
    setAccordionBooleanAttribute(controlledElement, "open", nextOpen);
    controlledElement.hidden = !nextOpen;
    return true;
  }
}

export class Trigger extends AccordionTriggerElement {}

export type TriggerElement = InstanceType<typeof Trigger>;
