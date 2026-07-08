import { AriaWebElement } from "@ariaui-web/utils";
import { badgePreservedDataAttributes } from "./badge-dom";
import {
  beginBadgeBaseContract,
  captureBadgeConsumerDataAttributes,
  endBadgeBaseContract,
  isBadgeInternalDataAttributeChange,
  restoreBadgeConsumerDataAttributes,
  syncBadgeInteractiveSemantics,
  trackBadgeConsumerDataAttribute,
} from "./badge-sync";

export class BadgeElement extends AriaWebElement {
  static override packageSlug = "badge";

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "as",
      ...badgePreservedDataAttributes,
    ]));
  }

  get as() {
    return this.getAttribute("as") ?? "div";
  }

  set as(value: string | null | undefined) {
    if (value == null || value === "" || value === "div") {
      this.removeAttribute("as");
    } else {
      this.setAttribute("as", String(value));
    }
  }

  override connectedCallback() {
    captureBadgeConsumerDataAttributes(this);
    beginBadgeBaseContract(this);
    try {
      super.connectedCallback();
    } finally {
      endBadgeBaseContract(this);
    }
    restoreBadgeConsumerDataAttributes(this);
    syncBadgeInteractiveSemantics(this);
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (isBadgeInternalDataAttributeChange(this, name)) {
      return;
    }

    trackBadgeConsumerDataAttribute(this, name, newValue);
    beginBadgeBaseContract(this);
    try {
      super.attributeChangedCallback(name, oldValue, newValue);
    } finally {
      endBadgeBaseContract(this);
    }

    restoreBadgeConsumerDataAttributes(this);
    syncBadgeInteractiveSemantics(this);
  }

  override afterAriaWebContractApplied() {
    restoreBadgeConsumerDataAttributes(this);
    syncBadgeInteractiveSemantics(this);
  }
}
