import { AriaWebElement } from "@ariaui-web/utils";
import {
  disconnectAspectRatioObserver,
  observeAspectRatioChildren,
  syncAspectRatioLayout,
} from "./aspect-ratio-sync";

export { resolveAspectRatio } from "./aspect-ratio-values";

export class AspectRatioElement extends AriaWebElement {
  static override packageSlug = "aspect-ratio";

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "native-composition", "ratio"]));
  }

  get ratio() {
    return this.getAttribute("ratio") ?? "1";
  }

  set ratio(value: string | number | null | undefined) {
    if (value == null) {
      this.removeAttribute("ratio");
      return;
    }

    this.setAttribute("ratio", String(value));
  }

  override connectedCallback() {
    super.connectedCallback();
    observeAspectRatioChildren(this);
  }

  disconnectedCallback() {
    disconnectAspectRatioObserver(this);
  }

  override afterAriaWebContractApplied() {
    syncAspectRatioLayout(this);
  }
}
