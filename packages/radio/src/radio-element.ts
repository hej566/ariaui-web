import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { handleRadioClick, handleRadioKeyDown } from "./radio-actions";
import {
  disconnectRadioTree,
  observeRadioTree,
  syncRadioAround,
} from "./radio-sync";

export class RadioWebElement extends AriaWebElement {
  get defaultValue() {
    return (
      this.getAttribute("default-value") ??
      this.getAttribute("defaultvalue") ??
      ""
    );
  }

  set defaultValue(value: string) {
    if (value == null) this.removeAttribute("default-value");
    else this.setAttribute("default-value", String(value));
  }

  radioPartName() {
    return (this.constructor as typeof RadioWebElement).partName;
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.radioPartName() === "Root") observeRadioTree(this);
    syncRadioAround(this);
  }

  disconnectedCallback() {
    if (this.radioPartName() === "Root") disconnectRadioTree(this);
  }

  override attributeChangedCallback(
    name?: string,
    oldValue?: string | null,
    newValue?: string | null,
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (this.isConnected) syncRadioAround(this);
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncRadioAround(this);
  }

  override handleAriaWebClick = (event: Event) => {
    handleRadioClick(this, event);
  };

  override handleCompositeRovingFocus(event: KeyboardEvent) {
    return handleRadioKeyDown(this, event);
  }
}

export function createRadioWebComponent(
  part: WebComponentPartSpec,
): typeof RadioWebElement {
  return class extends RadioWebElement {
    static override packageSlug = "radio";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
