import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { handleTabsClick, handleTabsKeyDown } from "./tabs-actions";
import { disconnectTabsRoot, observeTabsRoot, syncTabsAround } from "./tabs-sync";

export class TabsWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return [...super.observedAttributes, "id", "native-composition"];
  }

  get defaultValue() {
    return this.getAttribute("default-value") ?? this.getAttribute("defaultvalue") ?? "";
  }

  set defaultValue(value: string) {
    if (value == null) this.removeAttribute("default-value");
    else this.setAttribute("default-value", String(value));
  }

  get orientation() {
    return this.getAttribute("orientation") === "vertical" ? "vertical" : "horizontal";
  }

  set orientation(value: string) {
    this.setAttribute("orientation", value === "vertical" ? "vertical" : "horizontal");
  }

  tabsPartName() {
    return (this.constructor as typeof TabsWebElement).partName;
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.tabsPartName() === "Root") observeTabsRoot(this);
    else syncTabsAround(this);
  }

  disconnectedCallback() {
    if (this.tabsPartName() === "Root") disconnectTabsRoot(this);
  }

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (this.isConnected) syncTabsAround(this);
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncTabsAround(this);
  }

  override handleAriaWebClick = (event: Event) => {
    handleTabsClick(this, event);
  };

  override handleAriaWebKeyDown = (event: KeyboardEvent) => {
    handleTabsKeyDown(this, event);
  };

  override handleAriaWebKeyUp = () => {};
}

export function createTabsWebComponent(part: WebComponentPartSpec): typeof TabsWebElement {
  return class extends TabsWebElement {
    static override packageSlug = "tabs";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
