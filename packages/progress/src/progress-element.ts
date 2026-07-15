import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { disconnectProgressRoot, observeProgressRoot, syncProgressPart } from "./progress-sync";

function progressPartName(element: ProgressElement): WebComponentPartSpec["name"] {
  return (element.constructor as typeof ProgressElement).partName;
}

function finiteNumberAttribute(element: HTMLElement, name: string, fallback: number) {
  const value = element.getAttribute(name);
  if (value === null || value.trim() === "") {
    return fallback;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export class ProgressElement extends AriaWebElement {
  static override packageSlug = "progress";

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "max", "min", "value-text", "valuetext"]));
  }

  get defaultValue() {
    return this.getAttribute("default-value") ?? this.getAttribute("defaultvalue") ?? "";
  }

  set defaultValue(value: string | null) {
    if (value === null) {
      this.removeAttribute("default-value");
      this.removeAttribute("defaultvalue");
    } else {
      this.setAttribute("default-value", String(value));
    }
  }

  get max() {
    return finiteNumberAttribute(this, "max", 100);
  }

  set max(value: number) {
    this.setAttribute("max", String(value));
  }

  get min() {
    return finiteNumberAttribute(this, "min", 0);
  }

  set min(value: number) {
    this.setAttribute("min", String(value));
  }

  get valueText() {
    return this.getAttribute("value-text") ?? this.getAttribute("valuetext") ?? "";
  }

  set valueText(value: string | null) {
    if (value === null) {
      this.removeAttribute("value-text");
      this.removeAttribute("valuetext");
    } else {
      this.setAttribute("value-text", String(value));
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    if (progressPartName(this) === "Root") {
      observeProgressRoot(this);
    }
  }

  disconnectedCallback() {
    if (progressPartName(this) === "Root") {
      disconnectProgressRoot(this);
    }
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) {
      syncProgressPart(this);
    }
  }
}

export { ProgressElement as ProgressWebElement };
