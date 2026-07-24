import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { createPortalElement } from "@ariaui-web/portal";
import {
  handleHoverCardBlur,
  handleHoverCardFocus,
  handleHoverCardKeyDown,
  handleHoverCardMouseEnter,
  handleHoverCardMouseLeave,
} from "./hover-card-actions";
import {
  assertHoverCardStructure,
  hoverCardPartName,
  hoverCardRoot,
  registerHoverCardContent,
} from "./hover-card-dom";
import {
  disconnectHoverCardRoot,
  hoverCardObservedAttributes,
  observeHoverCardRoot,
  syncHoverCardPart,
} from "./hover-card-sync";

const hoverCardPortalHosts = new WeakMap<HTMLElement, HTMLElement>();
let hoverCardPortalId = 0;

export class HoverCardWebElement extends AriaWebElement {
  #hoverCardEventsBound = false;
  #hoverCardDocumentEventsBound = false;
  readonly #hoverCardMouseEnter = () => handleHoverCardMouseEnter(this);
  readonly #hoverCardMouseLeave = () => handleHoverCardMouseLeave(this);
  readonly #hoverCardFocus = () => handleHoverCardFocus(this);
  readonly #hoverCardBlur = (event: FocusEvent) =>
    handleHoverCardBlur(this, event);
  readonly #hoverCardKeyDown = (event: KeyboardEvent) =>
    handleHoverCardKeyDown(this, event);
  readonly #hoverCardDocumentKeyDown = (event: KeyboardEvent) =>
    handleHoverCardKeyDown(this, event);

  static override get observedAttributes() {
    return Array.from(
      new Set([...super.observedAttributes, ...hoverCardObservedAttributes()]),
    );
  }

  override connectedCallback() {
    super.connectedCallback();
    if (hoverCardPartName(this) === "Content") {
      this.#portalHoverCardContent();
    }
    assertHoverCardStructure(this);
    this.#bindHoverCardEvents();
    if (hoverCardPartName(this) === "Root") {
      observeHoverCardRoot(this);
    }
    syncHoverCardPart(this);
    this.#syncHoverCardDocumentEvents();
  }

  disconnectedCallback() {
    this.#unbindHoverCardEvents();
    if (hoverCardPartName(this) === "Root") {
      this.#unbindHoverCardDocumentEvents();
      disconnectHoverCardRoot(this);
    }
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    nextValue: string | null,
  ) {
    super.attributeChangedCallback(name, oldValue, nextValue);
    if (oldValue !== nextValue) {
      syncHoverCardPart(this);
      this.#syncHoverCardDocumentEvents();
    }
  }

  override afterAriaWebContractApplied() {
    syncHoverCardPart(this);
  }

  #bindHoverCardEvents() {
    if (this.#hoverCardEventsBound) return;
    const part = hoverCardPartName(this);
    if (part === "Trigger" || part === "Content") {
      this.addEventListener("mouseenter", this.#hoverCardMouseEnter);
      this.addEventListener("mouseleave", this.#hoverCardMouseLeave);
      this.addEventListener("keydown", this.#hoverCardKeyDown);
    }
    if (part === "Trigger") {
      this.addEventListener("focus", this.#hoverCardFocus);
      this.addEventListener("blur", this.#hoverCardBlur);
    }
    if (part === "Content") {
      this.addEventListener("focusin", this.#hoverCardFocus);
      this.addEventListener("focusout", this.#hoverCardBlur);
    }
    this.#hoverCardEventsBound = true;
  }

  #unbindHoverCardEvents() {
    if (!this.#hoverCardEventsBound) return;
    const part = hoverCardPartName(this);
    if (part === "Trigger" || part === "Content") {
      this.removeEventListener("mouseenter", this.#hoverCardMouseEnter);
      this.removeEventListener("mouseleave", this.#hoverCardMouseLeave);
      this.removeEventListener("keydown", this.#hoverCardKeyDown);
    }
    if (part === "Trigger") {
      this.removeEventListener("focus", this.#hoverCardFocus);
      this.removeEventListener("blur", this.#hoverCardBlur);
    }
    if (part === "Content") {
      this.removeEventListener("focusin", this.#hoverCardFocus);
      this.removeEventListener("focusout", this.#hoverCardBlur);
    }
    this.#hoverCardEventsBound = false;
  }

  #syncHoverCardDocumentEvents() {
    if (hoverCardPartName(this) !== "Root" || !this.isConnected) return;
    if (this.hasAttribute("open")) {
      this.#bindHoverCardDocumentEvents();
    } else {
      this.#unbindHoverCardDocumentEvents();
    }
  }

  #portalHoverCardContent() {
    if (hoverCardPortalHosts.has(this)) {
      return;
    }

    const root = hoverCardRoot(this);
    if (!(root instanceof HTMLElement)) {
      return;
    }

    registerHoverCardContent(root, this);
    const portal = root.querySelector<HTMLElement>(':scope > aria-portal[data-hover-card-portal="content"]')
      ?? createPortalElement();
    if (!this.id) {
      hoverCardPortalId += 1;
      this.id = `ariaui-hover-card-content-portal-${hoverCardPortalId}`;
    }
    portal.setAttribute("data-hover-card-portal", "content");
    portal.setAttribute("data-hover-card-portal-content", this.id);
    hoverCardPortalHosts.set(this, portal);
    if (!portal.isConnected) {
      this.before(portal);
    }
    portal.append(this);
  }

  #bindHoverCardDocumentEvents() {
    if (this.#hoverCardDocumentEventsBound) return;
    this.ownerDocument.addEventListener(
      "keydown",
      this.#hoverCardDocumentKeyDown,
    );
    this.#hoverCardDocumentEventsBound = true;
  }

  #unbindHoverCardDocumentEvents() {
    if (!this.#hoverCardDocumentEventsBound) return;
    this.ownerDocument.removeEventListener(
      "keydown",
      this.#hoverCardDocumentKeyDown,
    );
    this.#hoverCardDocumentEventsBound = false;
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
