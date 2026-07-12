import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import {
  bindSelectOutsideEvents,
  handleSelectClick,
  handleSelectKeyDown,
  handleSelectMouseOver,
  unbindSelectOutsideEvents,
} from "./select-actions";
import { syncSelectTreeAround } from "./select-sync";

export class SelectWebElement extends AriaWebElement {
  static override packageSlug = "select";

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "default-open",
      "defaultopen",
      "selection-mode",
      "selectionMode",
    ]));
  }

  override connectedCallback() {
    super.connectedCallback();
    if ((this.constructor as typeof SelectWebElement).partName === "Root") {
      bindSelectOutsideEvents(this);
      this.addEventListener("mouseover", this.#handleSelectMouseOver);
    }
  }

  disconnectedCallback() {
    if ((this.constructor as typeof SelectWebElement).partName === "Root") {
      unbindSelectOutsideEvents(this);
      this.removeEventListener("mouseover", this.#handleSelectMouseOver);
    }
  }

  override afterAriaWebContractApplied() {
    syncSelectTreeAround(this);
  }

  override handleAriaWebClick = (event: Event) => {
    handleSelectClick(this, event);
  };

  override handleAriaWebKeyDown = (event: KeyboardEvent) => {
    handleSelectKeyDown(this, event);
  };

  #handleSelectMouseOver = (event: MouseEvent) => {
    handleSelectMouseOver(this, event);
  };
}

export function createSelectWebComponent(part: WebComponentPartSpec): typeof SelectWebElement {
  return class extends SelectWebElement {
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
