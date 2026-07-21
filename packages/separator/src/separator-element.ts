import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import {
  disconnectSeparator,
  initializeSeparator,
  observeSeparator,
  separatorOrientation,
  syncSeparator,
  type SeparatorOrientation,
} from "./separator-sync";

export class SeparatorWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "aria-orientation",
      "class",
      "decorative",
      "native-composition",
      "role",
      "style",
    ]));
  }

  get decorative() { return this.hasAttribute("decorative"); }
  set decorative(value: boolean) { this.toggleAttribute("decorative", value); }
  get nativeComposition() { return this.hasAttribute("native-composition"); }
  set nativeComposition(value: boolean) { this.toggleAttribute("native-composition", value); }
  get orientation(): SeparatorOrientation { return separatorOrientation(this); }
  set orientation(value: SeparatorOrientation) { this.setAttribute("orientation", value); }

  override connectedCallback() {
    initializeSeparator(this);
    super.connectedCallback();
    observeSeparator(this);
    syncSeparator(this);
  }

  disconnectedCallback() {
    disconnectSeparator(this);
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncSeparator(this);
  }
}

export function createSeparatorWebComponent(part: WebComponentPartSpec): typeof SeparatorWebElement {
  return class extends SeparatorWebElement {
    static override packageSlug = "separator";
    static override partName = part.name;
    static override defaultRole = null;
    static override defaultAttributes = part.defaultAttributes;
  };
}
