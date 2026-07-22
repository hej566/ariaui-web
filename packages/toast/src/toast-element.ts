import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import {
  connectToastPart,
  disconnectToastPart,
  getToastItemOnClose,
  getToastTrigger,
  setToastTrigger,
  setToastItemOnClose,
  syncToastPart,
} from "./toast-runtime";

export class ToastWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "duration",
      "stack",
      "stack-offset",
      "stack-scale-step",
      "visible-toasts",
    ]));
  }

  get stack() {
    return this.hasAttribute("stack");
  }

  get duration() {
    return Number(this.getAttribute("duration") ?? 3000);
  }

  set duration(value: number) {
    this.setAttribute("duration", String(value));
  }

  get onClose() {
    return getToastItemOnClose(this);
  }

  set onClose(value: (() => void) | null) {
    setToastItemOnClose(this, value);
  }

  set stack(value: boolean) {
    this.toggleAttribute("stack", Boolean(value));
  }

  get visibleToasts() {
    return Number(this.getAttribute("visible-toasts") ?? 3);
  }

  set visibleToasts(value: number) {
    this.setAttribute("visible-toasts", String(value));
  }

  get stackOffset() {
    return Number(this.getAttribute("stack-offset") ?? 14);
  }

  set stackOffset(value: number) {
    this.setAttribute("stack-offset", String(value));
  }

  get stackScaleStep() {
    return Number(this.getAttribute("stack-scale-step") ?? 0.08);
  }

  set stackScaleStep(value: number) {
    this.setAttribute("stack-scale-step", String(value));
  }

  get trigger() {
    return getToastTrigger(this);
  }

  set trigger(value: HTMLElement | null) {
    setToastTrigger(this, value);
  }

  override connectedCallback() {
    super.connectedCallback();
    connectToastPart(this);
  }

  disconnectedCallback() {
    queueMicrotask(() => {
      if (!this.isConnected) disconnectToastPart(this);
    });
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncToastPart(this);
  }
}

export function createToastWebComponent(part: WebComponentPartSpec): typeof ToastWebElement {
  return class extends ToastWebElement {
    static override packageSlug = "toast";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
