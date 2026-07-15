import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { syncCommandInputValueFromElement, syncCommandTreeAround, syncCommandTreeFromRoot } from "./command-sync";

export class CommandWebElement extends AriaWebElement {
  static override packageSlug = "command";

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "always-render",
      "alwaysRender",
      "aria-label",
      "default-search-value",
      "defaultSearchValue",
      "disable-pointer-selection",
      "disablePointerSelection",
      "heading",
      "keywords",
      "label",
      "progress",
      "search-value",
      "searchValue",
      "should-filter",
      "shouldFilter",
    ]));
  }

  get searchValue() {
    return this.getAttribute("search-value") ?? this.getAttribute("searchValue") ?? "";
  }

  set searchValue(value: string) {
    if (value == null || value === "") {
      this.removeAttribute("search-value");
    } else {
      this.setAttribute("search-value", String(value));
    }
  }

  override afterAriaWebContractApplied() {
    syncCommandTreeAround(this);
  }

  syncCommandTreeFromRoot?: () => void;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("input", this.handleCommandInput);
    if ((this.constructor as typeof CommandWebElement).partName === "Root") {
      this.syncCommandTreeFromRoot = () => syncCommandTreeFromRoot(this);
    }
  }

  disconnectedCallback() {
    this.removeEventListener("input", this.handleCommandInput);
    if ((this.constructor as typeof CommandWebElement).partName === "Root") {
      delete this.syncCommandTreeFromRoot;
    }
  }

  handleCommandInput = (event: Event) => {
    if (!event.defaultPrevented) {
      syncCommandInputValueFromElement(this);
    }
  };
}

export function createCommandWebComponent(part: WebComponentPartSpec): typeof CommandWebElement {
  return class extends CommandWebElement {
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
