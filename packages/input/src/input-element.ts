import { AriaWebElement } from "@ariaui-web/utils";
import { ensureInputControl, setInputHostValue, syncInputPart } from "./input-sync";

export class InputElement extends AriaWebElement {
  static override packageSlug = "input";

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "aria-describedby",
      "aria-invalid",
      "aria-label",
      "autocomplete",
      "default-value",
      "defaultvalue",
      "inputmode",
      "isDisabled",
      "isRequired",
      "isdisabled",
      "isrequired",
      "maxlength",
      "minlength",
      "name",
      "pattern",
      "placeholder",
      "readonly",
      "role",
      "type",
    ]));
  }

  override get value() {
    return ensureInputControl(this).value;
  }

  override set value(value: string) {
    setInputHostValue(this, value);
  }

  get defaultValue() {
    return this.getAttribute("default-value") ?? this.getAttribute("defaultvalue") ?? "";
  }

  set defaultValue(value: string | null | undefined) {
    if (value == null) {
      this.removeAttribute("default-value");
    } else {
      this.setAttribute("default-value", String(value));
    }
  }

  override afterAriaWebContractApplied() {
    syncInputPart(this);
  }

  override focus(options?: FocusOptions) {
    ensureInputControl(this).focus(options);
  }
}
