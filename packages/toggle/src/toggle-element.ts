import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import {
  disconnectToggleHost,
  ensureToggleControl,
  getToggleDefaultPressed,
  getTogglePressed,
  getTogglePressedChange,
  observeToggleHost,
  setToggleDefaultPressed,
  setTogglePressed,
  setTogglePressedChange,
  syncTogglePart,
  updateTogglePressedAttribute,
} from "./toggle-sync";

export class ToggleWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "aria-describedby",
      "aria-label",
      "aria-labelledby",
      "autofocus",
      "class",
      "default-pressed",
      "form",
      "formaction",
      "formenctype",
      "formmethod",
      "formnovalidate",
      "formtarget",
      "id",
      "popovertarget",
      "popovertargetaction",
      "title",
    ]));
  }

  get control() {
    return ensureToggleControl(this);
  }

  override get pressed() {
    return getTogglePressed(this);
  }

  override set pressed(value: boolean) {
    setTogglePressed(this, value);
  }

  get defaultPressed() {
    return getToggleDefaultPressed(this);
  }

  set defaultPressed(value: boolean) {
    setToggleDefaultPressed(this, value);
  }

  get onPressedChange() {
    return getTogglePressedChange(this);
  }

  set onPressedChange(value: ((pressed: boolean) => void) | null) {
    setTogglePressedChange(this, value);
  }

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null) {
    if (name === "pressed" && oldValue !== newValue) updateTogglePressedAttribute(this, newValue != null);
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  override connectedCallback() {
    super.connectedCallback();
    observeToggleHost(this);
    syncTogglePart(this);
  }

  disconnectedCallback() {
    disconnectToggleHost(this);
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncTogglePart(this);
  }

  override focus(options?: FocusOptions) {
    this.control.focus(options);
  }

  override blur() {
    this.control.blur();
  }

  override handleAriaWebClick = (_event: Event) => {};
}

export function createToggleWebComponent(part: WebComponentPartSpec): typeof ToggleWebElement {
  return class extends ToggleWebElement {
    static override packageSlug = "toggle";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
