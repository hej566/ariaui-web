import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

const preservedDataAttributes = ["data-disabled", "data-slot", "data-state", "data-variant"] as const;

function isPreservedDataAttribute(name: string): name is typeof preservedDataAttributes[number] {
  return (preservedDataAttributes as readonly string[]).includes(name);
}

function badgeInteractiveRole(asValue: string | null) {
  if (asValue === "a") {
    return "link";
  }

  if (asValue === "button") {
    return "button";
  }

  return null;
}

export class BadgeWebElement extends AriaWebElement {
  #appliedRole: string | null = null;
  #appliedTabIndex: string | null = null;
  #applyingBaseContract = false;
  #restoringDataAttribute = false;
  #consumerDataAttributes = new Map<string, string>();

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "as",
      ...preservedDataAttributes,
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
    this.#applyingBaseContract = true;
    try {
      super.connectedCallback();
    } finally {
      this.#applyingBaseContract = false;
    }
    this.restoreConsumerDataAttributes();
    this.syncBadgeInteractiveSemantics();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (isPreservedDataAttribute(name) && (this.#applyingBaseContract || this.#restoringDataAttribute)) {
      return;
    }

    if (isPreservedDataAttribute(name) && !this.#applyingBaseContract && !this.#restoringDataAttribute) {
      if (newValue == null) {
        this.#consumerDataAttributes.delete(name);
      } else {
        this.#consumerDataAttributes.set(name, newValue);
      }
    }

    this.#applyingBaseContract = true;
    try {
      super.attributeChangedCallback(name, oldValue, newValue);
    } finally {
      this.#applyingBaseContract = false;
    }

    this.restoreConsumerDataAttributes();
    this.syncBadgeInteractiveSemantics();
  }

  override afterAriaWebContractApplied() {
    this.restoreConsumerDataAttributes();
    this.syncBadgeInteractiveSemantics();
  }

  restoreConsumerDataAttributes() {
    if (this.#consumerDataAttributes.size === 0) {
      return;
    }

    this.#restoringDataAttribute = true;
    try {
      for (const [attribute, value] of this.#consumerDataAttributes) {
        if (this.getAttribute(attribute) !== value) {
          this.setAttribute(attribute, value);
        }
      }
    } finally {
      this.#restoringDataAttribute = false;
    }
  }

  syncBadgeInteractiveSemantics() {
    const role = badgeInteractiveRole(this.getAttribute("as"));
    this.syncDefaultRole(role);
    this.syncDefaultTabIndex(role ? "0" : null);
  }

  syncDefaultRole(role: string | null) {
    const currentRole = this.getAttribute("role");

    if (!role) {
      if (this.#appliedRole && currentRole === this.#appliedRole) {
        this.#appliedRole = null;
        this.removeAttribute("role");
      }
      this.#appliedRole = null;
      return;
    }

    if (!currentRole || currentRole === this.#appliedRole) {
      this.#appliedRole = role;
      if (currentRole !== role) {
        this.setAttribute("role", role);
      }
      return;
    }

    if (currentRole !== role) {
      this.#appliedRole = null;
    }
  }

  syncDefaultTabIndex(tabIndex: string | null) {
    const currentTabIndex = this.getAttribute("tabindex");

    if (!tabIndex) {
      if (this.#appliedTabIndex && currentTabIndex === this.#appliedTabIndex) {
        this.#appliedTabIndex = null;
        this.removeAttribute("tabindex");
      }
      this.#appliedTabIndex = null;
      return;
    }

    if (!currentTabIndex || currentTabIndex === this.#appliedTabIndex) {
      this.#appliedTabIndex = tabIndex;
      if (currentTabIndex !== tabIndex) {
        this.setAttribute("tabindex", tabIndex);
      }
      return;
    }

    if (currentTabIndex !== tabIndex) {
      this.#appliedTabIndex = null;
    }
  }
}

export function createBadgeWebComponent(part: WebComponentPartSpec): typeof BadgeWebElement {
  return class extends BadgeWebElement {
    static override packageSlug = "badge";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
