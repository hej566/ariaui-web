import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { bindTreegridColumnHeader, bindTreegridRoot } from "./treegrid-actions";
import { treegridPartName } from "./treegrid-dom";
import {
  disconnectTreegrid,
  getExpandedCallback,
  getValueCallback,
  observeTreegrid,
  setExpandedCallback,
  setValueCallback,
  syncTreegridAround,
} from "./treegrid-sync";

export class TreegridWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "aria-label", "default-expanded", "expanded", "multi-select", "native-composition",
      "sort-direction", "sortable",
    ]));
  }

  get defaultExpanded() { return (this.getAttribute("default-expanded") ?? "").split(",").filter(Boolean); }
  set defaultExpanded(value: string[]) { this.setAttribute("default-expanded", value.join(",")); }
  get expanded() { return (this.getAttribute("expanded") ?? "").split(",").filter(Boolean); }
  set expanded(value: string[]) { this.setAttribute("expanded", value.join(",")); }
  get defaultValue() { return this.getAttribute("default-value") ?? ""; }
  set defaultValue(value: string | string[]) { this.setAttribute("default-value", Array.isArray(value) ? value.join(",") : value); }
  get multiSelect() { return this.hasAttribute("multi-select"); }
  set multiSelect(value: boolean) { this.toggleAttribute("multi-select", Boolean(value)); }
  get onExpandedChange() { return getExpandedCallback(this); }
  set onExpandedChange(value: ((items: string[]) => void) | null) { setExpandedCallback(this, value); }
  get onValueChange() { return getValueCallback(this); }
  set onValueChange(value: ((items: string | string[]) => void) | null) { setValueCallback(this, value); }
  get sortDirection() { return this.getAttribute("sort-direction") ?? ""; }
  set sortDirection(value: string) { if (value) this.setAttribute("sort-direction", value); else this.removeAttribute("sort-direction"); }
  get onSort() { return (this as unknown as { _onSort?: (() => void) | null })._onSort ?? null; }
  set onSort(value: (() => void) | null) { (this as unknown as { _onSort?: (() => void) | null })._onSort = value; }

  override connectedCallback() {
    super.connectedCallback();
    const part = treegridPartName(this);
    if (part === "Root") {
      bindTreegridRoot(this);
      observeTreegrid(this);
    }
    if (part === "ColumnHeader") bindTreegridColumnHeader(this);
    syncTreegridAround(this);
  }

  disconnectedCallback() {
    if (treegridPartName(this) === "Root") disconnectTreegrid(this);
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncTreegridAround(this);
  }
}

export function createTreegridWebComponent(part: WebComponentPartSpec): typeof TreegridWebElement {
  return class extends TreegridWebElement {
    static override packageSlug = "treegrid";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
