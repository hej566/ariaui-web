import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import {
  bindComboboxOutsideEvents,
  handleComboboxClick,
  handleComboboxInput,
  handleComboboxKeyDown,
  handleComboboxMouseDown,
  handleComboboxMouseOut,
  handleComboboxMouseOver,
  unbindComboboxOutsideEvents,
} from "./combobox-actions";
import { comboboxRoot } from "./combobox-dom";
import { syncComboboxTreeAround, syncComboboxTreeFromRoot } from "./combobox-sync";

export class ComboboxWebElement extends AriaWebElement {
  static override packageSlug = "combobox";

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "default-open",
      "defaultopen",
      "default-input-value",
      "defaultinputvalue",
      "input-value",
      "inputvalue",
      "selection-mode",
      "selectionMode",
    ]));
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("mousedown", this.#handleComboboxMouseDown);
    this.addEventListener("input", this.#handleComboboxInput);

    if ((this.constructor as typeof ComboboxWebElement).partName === "Root") {
      bindComboboxOutsideEvents(this);
      this.addEventListener("mouseover", this.#handleComboboxMouseOver);
      this.addEventListener("mouseout", this.#handleComboboxMouseOut);
      this.syncComboboxTreeFromRoot = () => syncComboboxTreeFromRoot(this);
    }
  }

  disconnectedCallback() {
    this.removeEventListener("mousedown", this.#handleComboboxMouseDown);
    this.removeEventListener("input", this.#handleComboboxInput);

    if ((this.constructor as typeof ComboboxWebElement).partName === "Root") {
      unbindComboboxOutsideEvents(this);
      this.removeEventListener("mouseover", this.#handleComboboxMouseOver);
      this.removeEventListener("mouseout", this.#handleComboboxMouseOut);
      delete this.syncComboboxTreeFromRoot;
    }
  }

  syncComboboxTreeFromRoot?: () => void;

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null) {
    if (name === "value" && oldValue !== newValue && (this.constructor as typeof ComboboxWebElement).partName === "Input") {
      const root = comboboxRoot(this);
      if (root instanceof HTMLElement && (root.getAttribute("input-value") ?? "") !== (newValue ?? "")) {
        if (newValue) {
          root.setAttribute("input-value", newValue);
        } else {
          root.removeAttribute("input-value");
        }
      }
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  override afterAriaWebContractApplied() {
    syncComboboxTreeAround(this);
  }

  override handleAriaWebClick = (event: Event) => {
    handleComboboxClick(this, event);
  };

  override handleAriaWebKeyDown = (event: KeyboardEvent) => {
    handleComboboxKeyDown(this, event);
  };

  #handleComboboxMouseDown = (event: MouseEvent) => {
    handleComboboxMouseDown(this, event);
  };

  #handleComboboxInput = (event: Event) => {
    handleComboboxInput(this, event);
  };

  #handleComboboxMouseOver = (event: MouseEvent) => {
    handleComboboxMouseOver(this, event);
  };

  #handleComboboxMouseOut = (event: MouseEvent) => {
    handleComboboxMouseOut(this, event);
  };
}

export function createComboboxWebComponent(part: WebComponentPartSpec): typeof ComboboxWebElement {
  return class extends ComboboxWebElement {
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
