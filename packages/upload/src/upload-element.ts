import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { bindUploadRoot, cleanupUpload } from "./upload-actions";
import { disconnectUpload, observeUpload, syncUploadAround } from "./upload-sync";
import { getErrorCallback, getSuccessCallback, setErrorCallback, setSuccessCallback, uploadPartName, uploadRoot, uploadState } from "./upload-state";

export class UploadWebElement extends AriaWebElement {
  #selectorClickBound = false;

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "disabled", "fallback", "format", "is-disabled", "max-length", "method", "url"]));
  }

  get files() {
    const root = uploadRoot(this);
    return root ? uploadState(root).files.map(({ file, id, thumbNailUrl }) => ({ file, id, thumbNailUrl })) : [];
  }
  get format() { return (this.getAttribute("format") ?? "").split(",").filter(Boolean); }
  set format(value: string[]) { this.setAttribute("format", value.join(",")); }
  get onError() { return getErrorCallback(this); }
  set onError(value: ((payload: unknown) => void) | null) { setErrorCallback(this, value); }
  get onSuccess() { return getSuccessCallback(this); }
  set onSuccess(value: ((payload: unknown) => void) | null) { setSuccessCallback(this, value); }

  override connectedCallback() {
    super.connectedCallback();
    const partName = uploadPartName(this);
    if (partName === "Root") {
      bindUploadRoot(this);
      observeUpload(this);
    } else if (partName === "Selector" && !this.#selectorClickBound) {
      this.addEventListener("click", this.handleSelectorClick);
      this.#selectorClickBound = true;
    }
    syncUploadAround(this);
  }

  disconnectedCallback() {
    if (uploadPartName(this) === "Root") {
      disconnectUpload(this);
      cleanupUpload(this);
    }
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncUploadAround(this);
  }

  private handleSelectorClick = (event: MouseEvent) => {
    if (event.defaultPrevented || this.hasAttribute("disabled") || this.hasAttribute("is-disabled")) return;
    const input = this.querySelector<HTMLInputElement>("input[data-upload-input]");
    if (!input || event.target === input) return;
    event.stopPropagation();
    input.click();
  };
}

export function createUploadWebComponent(part: WebComponentPartSpec): typeof UploadWebElement {
  return class extends UploadWebElement {
    static override packageSlug = "upload";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
