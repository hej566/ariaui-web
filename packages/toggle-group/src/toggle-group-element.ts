import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { toggleGroupPartName } from "./toggle-group-dom";
import {
  disconnectToggleGroup,
  getToggleGroupActiveChange,
  getToggleGroupDefaultValue,
  getToggleGroupMode,
  getToggleGroupValue,
  getToggleGroupValueChange,
  observeToggleGroup,
  setToggleGroupActiveChange,
  setToggleGroupDefaultValue,
  setToggleGroupMode,
  setToggleGroupValue,
  setToggleGroupValueChange,
  syncStandaloneItem,
  syncToggleGroup,
  updateToggleGroupAttribute,
} from "./toggle-group-sync";
import type { ToggleGroupMode, ToggleGroupValue } from "./toggle-group-sync";

export class ToggleGroupWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "aria-describedby",
      "aria-label",
      "aria-labelledby",
      "autofocus",
      "class",
      "default-value",
      "form",
      "formaction",
      "formenctype",
      "formmethod",
      "formnovalidate",
      "formtarget",
      "id",
      "is-active",
      "mode",
      "title",
    ]));
  }

  get control() {
    if (toggleGroupPartName(this) !== "Item") return null;
    syncStandaloneItem(this);
    return this.querySelector<HTMLButtonElement>(":scope > button[data-ariaui-web-toggle-group-control='true']");
  }

  get mode() { return getToggleGroupMode(this); }
  set mode(value: ToggleGroupMode) { setToggleGroupMode(this, value); }
  override get value(): any {
    if (toggleGroupPartName(this) === "Item") return this.getAttribute("value") ?? "";
    return getToggleGroupValue(this);
  }
  override set value(value: any) {
    if (toggleGroupPartName(this) === "Item") {
      if (value == null) this.removeAttribute("value");
      else this.setAttribute("value", String(value));
      return;
    }
    setToggleGroupValue(this, value as ToggleGroupValue);
  }
  get defaultValue() { return getToggleGroupDefaultValue(this); }
  set defaultValue(value: ToggleGroupValue) { setToggleGroupDefaultValue(this, value); }
  get onValueChange() { return getToggleGroupValueChange(this); }
  set onValueChange(value: ((nextValue: ToggleGroupValue) => void) | null) { setToggleGroupValueChange(this, value); }
  get onActiveChange() { return getToggleGroupActiveChange(this); }
  set onActiveChange(value: ((active: boolean[]) => void) | null) { setToggleGroupActiveChange(this, value); }
  get isActive() { return this.control?.dataset.active === "true" || this.hasAttribute("is-active"); }
  set isActive(value: boolean) { this.toggleAttribute("is-active", Boolean(value)); }

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null) {
    if (name && oldValue !== newValue && toggleGroupPartName(this) === "Root") updateToggleGroupAttribute(this, name, newValue ?? null);
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  override connectedCallback() {
    super.connectedCallback();
    if (toggleGroupPartName(this) === "Root") {
      observeToggleGroup(this);
      syncToggleGroup(this);
    } else {
      const root = this.parentElement?.closest<HTMLElement>("aria-toggle-group");
      if (root) syncToggleGroup(root);
      else syncStandaloneItem(this);
    }
  }

  disconnectedCallback() {
    if (toggleGroupPartName(this) === "Root") disconnectToggleGroup(this);
  }

  override afterAriaWebContractApplied() {
    if (!this.isConnected) return;
    if (toggleGroupPartName(this) === "Root") syncToggleGroup(this);
    else {
      const root = this.parentElement?.closest<HTMLElement>("aria-toggle-group");
      if (root) syncToggleGroup(root);
      else syncStandaloneItem(this);
    }
  }

  override focus(options?: FocusOptions) { this.control?.focus(options); }
  override blur() { this.control?.blur(); }
  override handleAriaWebClick = (_event: Event) => {};
}

export function createToggleGroupWebComponent(part: WebComponentPartSpec): typeof ToggleGroupWebElement {
  return class extends ToggleGroupWebElement {
    static override packageSlug = "toggle-group";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
