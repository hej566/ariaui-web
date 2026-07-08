import { AriaWebElement } from "@ariaui-web/utils";
import { avatarObservedAttributes } from "./avatar-dom";
import {
  avatarLoadingStatus,
  disconnectAvatarElement,
  handleAvatarAttributeChange,
  observeAvatarChildren,
  syncAvatarPart,
} from "./avatar-sync";

export type { AvatarImageLoadingStatus } from "./avatar-dom";

export class AvatarElement extends AriaWebElement {
  static override packageSlug = "avatar";

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, ...avatarObservedAttributes]));
  }

  get src() {
    return this.getAttribute("src") ?? "";
  }

  set src(value: string | null | undefined) {
    if (value == null || value === "") {
      this.removeAttribute("src");
    } else {
      this.setAttribute("src", String(value));
    }
  }

  get loadingStatus() {
    return avatarLoadingStatus(this);
  }

  override connectedCallback() {
    super.connectedCallback();
    observeAvatarChildren(this);
    syncAvatarPart(this);
  }

  disconnectedCallback() {
    disconnectAvatarElement(this);
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (oldValue === newValue) {
      return;
    }

    handleAvatarAttributeChange(this, name);
    syncAvatarPart(this);
  }

  override afterAriaWebContractApplied() {
    syncAvatarPart(this);
  }
}
