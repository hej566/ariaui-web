import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import {
  handleHoverCardBlur,
  handleHoverCardFocus,
  handleHoverCardKeyDown,
  handleHoverCardMouseEnter,
  handleHoverCardMouseLeave,
} from "./hover-card-actions";
import { assertHoverCardStructure, hoverCardPartName } from "./hover-card-dom";
import {
  disconnectHoverCardRoot,
  hoverCardObservedAttributes,
  observeHoverCardRoot,
  syncHoverCardPart,
} from "./hover-card-sync";

export class HoverCardWebElement extends AriaWebElement {
  #hoverCardEventsBound = false;
  readonly #hoverCardMouseEnter = () => handleHoverCardMouseEnter(this);
  readonly #hoverCardMouseLeave = () => handleHoverCardMouseLeave(this);
  readonly #hoverCardFocus = () => handleHoverCardFocus(this);
  readonly #hoverCardBlur = () => handleHoverCardBlur(this);
  readonly #hoverCardKeyDown = (event: KeyboardEvent) =>
    handleHoverCardKeyDown(this, event);

  static override get observedAttributes() {
    return Array.from(
      new Set([...super.observedAttributes, ...hoverCardObservedAttributes()]),
    );
  }

  override connectedCallback() {
    super.connectedCallback();
    assertHoverCardStructure(this);
    this.#bindHoverCardEvents();
    if (hoverCardPartName(this) === "Root") observeHoverCardRoot(this);
    syncHoverCardPart(this);
  }

  disconnectedCallback() {
    this.#unbindHoverCardEvents();
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

  #bindHoverCardEvents() {
    if (this.#hoverCardEventsBound) return;
    this.addEventListener("mouseenter", this.#hoverCardMouseEnter);
    this.addEventListener("mouseleave", this.#hoverCardMouseLeave);
    this.addEventListener("focus", this.#hoverCardFocus);
    this.addEventListener("blur", this.#hoverCardBlur);
    this.addEventListener("keydown", this.#hoverCardKeyDown);
    this.#hoverCardEventsBound = true;
  }

  #unbindHoverCardEvents() {
    if (!this.#hoverCardEventsBound) return;
    this.removeEventListener("mouseenter", this.#hoverCardMouseEnter);
    this.removeEventListener("mouseleave", this.#hoverCardMouseLeave);
    this.removeEventListener("focus", this.#hoverCardFocus);
    this.removeEventListener("blur", this.#hoverCardBlur);
    this.removeEventListener("keydown", this.#hoverCardKeyDown);
    this.#hoverCardEventsBound = false;
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
