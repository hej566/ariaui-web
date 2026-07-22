import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import {
  disconnectTextareaHost,
  ensureTextareaControl,
  observeTextareaHost,
  setTextareaHostDefaultValue,
  setTextareaHostValue,
  syncTextareaPart,
} from "./textarea-sync";

export class TextareaWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "aria-describedby",
      "aria-errormessage",
      "aria-invalid",
      "aria-label",
      "aria-labelledby",
      "autocapitalize",
      "autocomplete",
      "autofocus",
      "class",
      "cols",
      "dirname",
      "form",
      "id",
      "inputmode",
      "maxlength",
      "minlength",
      "name",
      "placeholder",
      "readonly",
      "role",
      "rows",
      "spellcheck",
      "tabindex",
      "title",
      "wrap",
    ]));
  }

  get control() {
    return ensureTextareaControl(this);
  }

  override get value() {
    return this.control.value;
  }

  override set value(value: string) {
    setTextareaHostValue(this, value);
  }

  get defaultValue() {
    return this.getAttribute("default-value") ?? this.getAttribute("defaultvalue") ?? "";
  }

  set defaultValue(value: string) {
    setTextareaHostDefaultValue(this, value);
  }

  get required() {
    return this.hasAttribute("required");
  }

  set required(value: boolean) {
    this.toggleAttribute("required", Boolean(value));
  }

  get readOnly() {
    return this.hasAttribute("readonly");
  }

  set readOnly(value: boolean) {
    this.toggleAttribute("readonly", Boolean(value));
  }

  get selectionStart() {
    return this.control.selectionStart;
  }

  set selectionStart(value: number | null) {
    this.control.selectionStart = value ?? 0;
  }

  get selectionEnd() {
    return this.control.selectionEnd;
  }

  set selectionEnd(value: number | null) {
    this.control.selectionEnd = value ?? 0;
  }

  get textLength() {
    return this.control.textLength;
  }

  get validity() {
    return this.control.validity;
  }

  get validationMessage() {
    return this.control.validationMessage;
  }

  get willValidate() {
    return this.control.willValidate;
  }

  override connectedCallback() {
    super.connectedCallback();
    observeTextareaHost(this);
    syncTextareaPart(this);
  }

  disconnectedCallback() {
    disconnectTextareaHost(this);
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncTextareaPart(this);
  }

  override focus(options?: FocusOptions) {
    this.control.focus(options);
  }

  override blur() {
    this.control.blur();
  }

  select() {
    this.control.select();
  }

  setSelectionRange(start: number | null, end: number | null, direction?: "forward" | "backward" | "none") {
    this.control.setSelectionRange(start, end, direction);
  }

  setRangeText(replacement: string, start?: number, end?: number, selectionMode?: SelectionMode) {
    if (start == null || end == null) this.control.setRangeText(replacement);
    else this.control.setRangeText(replacement, start, end, selectionMode);
  }

  checkValidity() {
    return this.control.checkValidity();
  }

  reportValidity() {
    return this.control.reportValidity();
  }

  setCustomValidity(error: string) {
    this.control.setCustomValidity(error);
  }
}

export function createTextareaWebComponent(part: WebComponentPartSpec): typeof TextareaWebElement {
  return class extends TextareaWebElement {
    static override packageSlug = "textarea";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
