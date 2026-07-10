import { AriaWebElement } from "@ariaui-web/utils";
import { bindInputOtpPart, focusInputOtpRoot } from "./input-otp-actions";
import { inputOtpPartName } from "./input-otp-dom";
import { setInputOtpRootValue, syncInputOtpPart } from "./input-otp-sync";

export class InputOtpElement extends AriaWebElement {
  static override packageSlug = "input-otp";

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "aria-describedby",
      "aria-label",
      "aria-labelledby",
      "auto-focus",
      "autofocus",
      "default-value",
      "defaultvalue",
      "disabled",
      "index",
      "max-length",
      "maxlength",
      "name",
      "native-composition",
      "required",
      "value",
    ]));
  }

  override get value() {
    return inputOtpPartName(this) === "Root"
      ? setInputOtpRootValue(this, undefined, { read: true })
      : this.getAttribute("value") ?? "";
  }

  override set value(value: string) {
    if (inputOtpPartName(this) === "Root") {
      setInputOtpRootValue(this, value, { emit: false });
    } else if (value == null) {
      this.removeAttribute("value");
    } else {
      this.setAttribute("value", String(value));
    }
  }

  get maxLength() {
    const value = this.getAttribute("max-length") ?? this.getAttribute("maxlength");
    return value == null ? 0 : Number.parseInt(value, 10) || 0;
  }

  set maxLength(value: number | string | null | undefined) {
    if (value == null || value === "") {
      this.removeAttribute("max-length");
    } else {
      this.setAttribute("max-length", String(value));
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    bindInputOtpPart(this);
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    bindInputOtpPart(this);
  }

  override afterAriaWebContractApplied() {
    syncInputOtpPart(this);
  }

  override focus(options?: FocusOptions) {
    if (inputOtpPartName(this) === "Root") {
      focusInputOtpRoot(this, options);
      return;
    }

    super.focus(options);
  }
}
