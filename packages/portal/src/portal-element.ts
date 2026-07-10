import { AriaWebElement } from "@ariaui-web/utils";

const portalStateReflectionAttributes = [
  "aria-checked",
  "aria-disabled",
  "aria-expanded",
  "aria-pressed",
  "aria-selected",
  "data-disabled",
  "data-orientation",
  "data-state",
  "data-value",
] as const;

export class PortalElement extends AriaWebElement {
  static override packageSlug = "portal";
  #portalObserver: MutationObserver | null = null;
  #portalledNodes = new Set<Node>();

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "class",
      "style",
      "title",
    ]));
  }

  override connectedCallback() {
    super.connectedCallback();
    this.startPortalObserver();
    this.syncPortalToBody();
  }

  disconnectedCallback() {
    this.#portalObserver?.disconnect();
    this.#portalObserver = null;
    this.removePortalledNodes();
  }

  override bindAriaWebEvents() {
    // Portal is a rendering utility. It forwards authored DOM behavior without
    // disabled guards, activation handlers, or keyboard interaction.
  }

  override afterAriaWebContractApplied() {
    removePortalStateReflection(this);
    this.syncPortalToBody();
  }

  private startPortalObserver() {
    if (this.#portalObserver || typeof MutationObserver === "undefined") {
      return;
    }

    this.#portalObserver = new MutationObserver(() => {
      this.syncPortalToBody();
    });
    this.#portalObserver.observe(this, { childList: true });
  }

  private syncPortalToBody() {
    if (!this.isConnected || !this.ownerDocument?.body) {
      return;
    }

    for (const node of Array.from(this.childNodes)) {
      this.#portalledNodes.add(node);
      this.ownerDocument.body.append(node);
    }
  }

  private removePortalledNodes() {
    for (const node of this.#portalledNodes) {
      node.parentNode?.removeChild(node);
    }

    this.#portalledNodes.clear();
  }
}

function removePortalStateReflection(element: HTMLElement) {
  for (const attribute of portalStateReflectionAttributes) {
    element.removeAttribute(attribute);
  }

  element.querySelector("input[data-ariaui-web-hidden-input='true']")?.remove();
}
