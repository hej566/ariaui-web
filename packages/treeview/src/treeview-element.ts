import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { bindTreeviewRoot } from "./treeview-actions";
import { treeviewPartName } from "./treeview-dom";
import { disconnectTreeview, getExpandedCallback, getValueCallback, observeTreeview, setExpandedCallback, setValueCallback, syncTreeviewAround } from "./treeview-sync";

export class TreeviewWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "default-expanded", "expanded", "multi-select", "native-composition", "force-mount"]));
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

  override connectedCallback() {
    super.connectedCallback();
    if (treeviewPartName(this) === "Root") {
      bindTreeviewRoot(this);
      observeTreeview(this);
    }
    syncTreeviewAround(this);
  }

  disconnectedCallback() {
    if (treeviewPartName(this) === "Root") disconnectTreeview(this);
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncTreeviewAround(this);
  }
}

export function createTreeviewWebComponent(part: WebComponentPartSpec): typeof TreeviewWebElement {
  return class extends TreeviewWebElement {
    static override packageSlug = "treeview";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
