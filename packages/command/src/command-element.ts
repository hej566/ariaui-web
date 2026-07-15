import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import {
  handleCommandClick,
  handleCommandInput,
  handleCommandKeyDown,
  handleCommandPointerMove,
  selectCommandOption,
} from "./command-actions";
import { syncCommandTreeAround, syncCommandTreeFromRoot } from "./command-sync";

export class CommandWebElement extends AriaWebElement {
  static override packageSlug = "command";
  #dispatchingProgrammaticOptionClick = false;

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
      "loop",
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
    this.addEventListener("input", this.#handleCommandInput);
    this.addEventListener("pointermove", this.#handleCommandPointerMove);
    if ((this.constructor as typeof CommandWebElement).partName === "Root") {
      this.syncCommandTreeFromRoot = () => syncCommandTreeFromRoot(this);
    }
  }

  disconnectedCallback() {
    this.removeEventListener("input", this.#handleCommandInput);
    this.removeEventListener("pointermove", this.#handleCommandPointerMove);
    if ((this.constructor as typeof CommandWebElement).partName === "Root") {
      delete this.syncCommandTreeFromRoot;
    }
  }

  override click() {
    if (this.getAttribute("data-part") === "Option" && this.closest("aria-command") instanceof HTMLElement) {
      const event = new MouseEvent("click", { bubbles: true, cancelable: true, composed: true });
      this.#dispatchingProgrammaticOptionClick = true;
      const accepted = this.dispatchEvent(event);
      this.#dispatchingProgrammaticOptionClick = false;
      if (accepted) {
        selectCommandOption(this);
      }
      return;
    }

    super.click();
  }

  override handleAriaWebClick = (event: Event) => {
    if (this.#dispatchingProgrammaticOptionClick) {
      return;
    }
    handleCommandClick(this, event);
  };

  override handleAriaWebKeyDown = (event: KeyboardEvent) => {
    handleCommandKeyDown(this, event);
  };

  #handleCommandInput = (event: Event) => {
    handleCommandInput(this, event);
  };

  #handleCommandPointerMove = (event: Event) => {
    handleCommandPointerMove(this, event);
  };
}

export function createCommandWebComponent(part: WebComponentPartSpec): typeof CommandWebElement {
  return class extends CommandWebElement {
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
