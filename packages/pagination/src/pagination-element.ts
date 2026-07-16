import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { handlePaginationClick } from "./pagination-actions";
import { syncPaginationTreeAround } from "./pagination-sync";

export class PaginationWebElement extends AriaWebElement {
  static override packageSlug = "pagination";
  #paginationEventsBound = false;

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "active-class",
      "active-class-name",
      "activeclassname",
      "default-page",
      "defaultpage",
      "is-active",
      "isactive",
      "max-visible-pages",
      "maxvisiblepages",
      "page",
      "total-pages",
      "totalpages",
    ]));
  }

  get totalPages() {
    return Number(this.getAttribute("total-pages") ?? this.getAttribute("totalpages") ?? 1);
  }

  set totalPages(value: number) {
    if (value == null) {
      this.removeAttribute("total-pages");
    } else {
      this.setAttribute("total-pages", String(value));
    }
  }

  get maxVisiblePages() {
    return Number(this.getAttribute("max-visible-pages") ?? this.getAttribute("maxvisiblepages") ?? 5);
  }

  set maxVisiblePages(value: number) {
    if (value == null) {
      this.removeAttribute("max-visible-pages");
    } else {
      this.setAttribute("max-visible-pages", String(value));
    }
  }

  get page() {
    return Number(this.getAttribute("page") ?? 1);
  }

  set page(value: number) {
    if (value == null) {
      this.removeAttribute("page");
    } else {
      this.setAttribute("page", String(value));
    }
  }

  get defaultPage() {
    return Number(this.getAttribute("default-page") ?? this.getAttribute("defaultpage") ?? 1);
  }

  set defaultPage(value: number) {
    if (value == null) {
      this.removeAttribute("default-page");
    } else {
      this.setAttribute("default-page", String(value));
    }
  }

  paginationPartName() {
    return (this.constructor as typeof PaginationWebElement).partName;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.bindPaginationEvents();
    syncPaginationTreeAround(this);
  }

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    syncPaginationTreeAround(this);
  }

  override afterAriaWebContractApplied() {
    syncPaginationTreeAround(this);
  }

  bindPaginationEvents() {
    if (this.#paginationEventsBound) {
      return;
    }

    const partName = this.paginationPartName();
    if (partName === "Link" || partName === "Previous" || partName === "Next") {
      this.addEventListener("click", this.handlePaginationClick);
    }

    this.#paginationEventsBound = true;
  }

  handlePaginationClick = (event: Event) => {
    handlePaginationClick(this, event);
  };
}

export function createPaginationWebComponent(part: WebComponentPartSpec): typeof PaginationWebElement {
  return class extends PaginationWebElement {
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
