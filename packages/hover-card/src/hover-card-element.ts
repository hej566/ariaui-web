import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { assertHoverCardStructure, hoverCardPartName } from "./hover-card-dom";
import {
  disconnectHoverCardRoot,
  hoverCardObservedAttributes,
  observeHoverCardRoot,
  syncHoverCardPart,
} from "./hover-card-sync";

export class HoverCardWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(
      new Set([...super.observedAttributes, ...hoverCardObservedAttributes()]),
    );
  }

  override connectedCallback() {
    super.connectedCallback();
    assertHoverCardStructure(this);
    if (hoverCardPartName(this) === "Root") observeHoverCardRoot(this);
    syncHoverCardPart(this);
  }

  disconnectedCallback() {
    if (hoverCardPartName(this) === "Root") disconnectHoverCardRoot(this);
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    nextValue: string | null,
  ) {
    super.attributeChangedCallback(name, oldValue, nextValue);
    if (oldValue !== nextValue) syncHoverCardPart(this);
  }

  override afterAriaWebContractApplied() {
    syncHoverCardPart(this);
  }
}

export function createHoverCardWebComponent(
  part: WebComponentPartSpec,
): typeof HoverCardWebElement {
  return class extends HoverCardWebElement {
    static override packageSlug = "hover-card";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
