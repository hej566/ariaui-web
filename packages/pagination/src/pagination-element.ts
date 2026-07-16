import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { paginationRoot } from "./pagination-dom";
import {
  cleanupPaginationRoot,
  paginationActionPage,
  requestPaginationPage,
  syncPaginationTreeAround,
  syncPaginationTreeFromRoot,
} from "./pagination-sync";

export class PaginationWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "default-page",
      "max-visible-pages",
      "page",
      "total-pages",
    ]));
  }

  #paginationClickBound = false;

  override connectedCallback() {
    super.connectedCallback();
    if (!this.#paginationClickBound) {
      this.addEventListener("click", this.handlePaginationClick);
      this.#paginationClickBound = true;
    }
    if ((this.constructor as typeof PaginationWebElement).partName === "Root") {
      this.syncPaginationTreeFromRoot();
    }
  }

  disconnectedCallback() {
    if ((this.constructor as typeof PaginationWebElement).partName === "Root") {
      cleanupPaginationRoot(this);
    }
  }

  override afterAriaWebContractApplied() {
    syncPaginationTreeAround(this);
  }

  syncPaginationTreeFromRoot() {
    syncPaginationTreeFromRoot(this);
  }

  handlePaginationClick = (event: Event) => {
    if (event.defaultPrevented) return;
    const target = event.target instanceof HTMLElement
      ? event.target.closest<HTMLElement>("aria-pagination-previous, aria-pagination-link, aria-pagination-next")
      : null;
    if (!target || !this.contains(target) || target.getAttribute("aria-disabled") === "true") return;
    const root = paginationRoot(target);
    if (!(root instanceof HTMLElement)) return;
    const page = paginationActionPage(target);
    if (!page) return;
    event.preventDefault();
    requestPaginationPage(root, page);
  };
}

export function createPaginationWebComponent(part: WebComponentPartSpec): typeof PaginationWebElement {
  return class extends PaginationWebElement {
    static override packageSlug = "pagination";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
