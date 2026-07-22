import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { bindTooltipContent, bindTooltipTrigger } from "./tooltip-actions";
import { tooltipContentControl, tooltipPartName, tooltipRoot, tooltipTriggerControl } from "./tooltip-dom";
import {
  disconnectTooltipRoot,
  ensureTooltipTriggerControl,
  getTooltipOpenChange,
  observeTooltipRoot,
  portalTooltipContent,
  setTooltipOpenChange,
  syncTooltipPart,
  syncTooltipRoot,
} from "./tooltip-sync";

export class TooltipWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "aria-describedby", "aria-label", "arrow", "arrow-class", "class", "default-open", "focus",
      "hover", "native-composition", "offset", "placement", "style", "title",
    ]));
  }

  get control() {
    const part = tooltipPartName(this);
    if (part === "Trigger") return tooltipTriggerControl(this) ?? ensureTooltipTriggerControl(this);
    if (part === "Content") return tooltipContentControl(this);
    return null;
  }

  get defaultOpen() { return this.hasAttribute("default-open"); }
  set defaultOpen(value: boolean) { this.toggleAttribute("default-open", Boolean(value)); }
  get placement() { return this.getAttribute("placement") ?? "top"; }
  set placement(value: string) { this.setAttribute("placement", value); }
  get offset() { return Number(this.getAttribute("offset") ?? "5"); }
  set offset(value: number) { this.setAttribute("offset", String(value)); }
  get onOpenChange() { return getTooltipOpenChange(this); }
  set onOpenChange(value: ((open: boolean) => void) | null) { setTooltipOpenChange(this, value); }

  override connectedCallback() {
    super.connectedCallback();
    const part = tooltipPartName(this);
    if (part === "Root") observeTooltipRoot(this);
    if (part === "Content") portalTooltipContent(this);
    this.#bindPartEvents();
    syncTooltipPart(this);
  }

  disconnectedCallback() {
    if (tooltipPartName(this) === "Root") disconnectTooltipRoot(this);
  }

  override afterAriaWebContractApplied() {
    this.#bindPartEvents();
    syncTooltipPart(this);
  }

  override focus(options?: FocusOptions) { this.control?.focus(options); }
  override blur() { this.control?.blur(); }
  override handleAriaWebClick = (_event: Event) => {};

  #bindPartEvents() {
    if (!this.isConnected) return;
    const part = tooltipPartName(this);
    if (part === "Trigger") bindTooltipTrigger(this, ensureTooltipTriggerControl(this));
    if (part === "Content") bindTooltipContent(this, tooltipContentControl(this));
    const root = tooltipRoot(this);
    if (root && part !== "Root") syncTooltipRoot(root);
  }
}

export function createTooltipWebComponent(part: WebComponentPartSpec): typeof TooltipWebElement {
  return class extends TooltipWebElement {
    static override packageSlug = "tooltip";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
