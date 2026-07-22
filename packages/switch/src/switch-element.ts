import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { handleSwitchClick, handleSwitchKeyDown } from "./switch-actions";
import { disconnectSwitchRoot, observeSwitchRoot, syncSwitchAround } from "./switch-sync";

const initializedRoots = new WeakSet<SwitchWebElement>();

export class SwitchWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return [...super.observedAttributes, "id", "native-composition"];
  }

  switchPartName() {
    return (this.constructor as typeof SwitchWebElement).partName;
  }

  override connectedCallback() {
    if (
      this.switchPartName() === "Root" &&
      !initializedRoots.has(this) &&
      this.hasAttribute("default-checked") &&
      !this.hasAttribute("checked")
    ) {
      this.setAttribute("checked", "");
    }
    if (this.switchPartName() === "Root") initializedRoots.add(this);
    super.connectedCallback();
    if (this.switchPartName() === "Root") observeSwitchRoot(this);
    else syncSwitchAround(this);
  }

  disconnectedCallback() {
    if (this.switchPartName() === "Root") disconnectSwitchRoot(this);
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncSwitchAround(this);
  }

  override handleAriaWebClick = (event: Event) => {
    handleSwitchClick(this, event);
  };

  override handleAriaWebKeyDown = (event: KeyboardEvent) => {
    handleSwitchKeyDown(this, event);
  };

  override handleAriaWebKeyUp = () => {};
}

export function createSwitchWebComponent(part: WebComponentPartSpec): typeof SwitchWebElement {
  return class extends SwitchWebElement {
    static override packageSlug = "switch";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
