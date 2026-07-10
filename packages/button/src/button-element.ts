import { AriaWebElement } from "@ariaui-web/utils";
import { handleButtonClick, handleButtonKeyDown, handleButtonKeyUp } from "./button-actions";
import { disconnectButtonPart, syncButtonPart } from "./button-sync";

export class ButtonElement extends AriaWebElement {
  static override packageSlug = "button";

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "as",
      "href",
      "role",
    ]));
  }

  get as() {
    return this.getAttribute("as") ?? "button";
  }

  set as(value: string | null | undefined) {
    if (value == null || value === "" || value === "button") {
      this.removeAttribute("as");
    } else {
      this.setAttribute("as", String(value));
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    syncButtonPart(this);
  }

  disconnectedCallback() {
    disconnectButtonPart(this);
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    syncButtonPart(this);
  }

  override afterAriaWebContractApplied() {
    syncButtonPart(this);
  }

  override handleAriaWebClick = (event: Event) => {
    handleButtonClick(this, event);
  };

  override handleAriaWebKeyDown = (event: KeyboardEvent) => {
    handleButtonKeyDown(this, event);
  };

  override handleAriaWebKeyUp = (event: KeyboardEvent) => {
    handleButtonKeyUp(this, event);
  };
}
