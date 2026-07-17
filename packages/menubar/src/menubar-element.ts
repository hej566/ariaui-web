import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { dismissMenubarFromOutside, handleMenubarClick, handleMenubarFocusIn, handleMenubarKeyDown, handleMenubarMouseOver } from "./menubar-actions";
import { menubarContentHost, menubarPartName, menubarRoot } from "./menubar-dom";
import { stopMenubarPositioning } from "./menubar-position";
import { syncMenubarAround, syncMenubarRoot, syncMenubarStandalone } from "./menubar-sync";

const observers = new WeakMap<HTMLElement, MutationObserver>();
const outsideHandlers = new WeakMap<HTMLElement, (event: PointerEvent) => void>();
const outsideFocusHandlers = new WeakMap<HTMLElement, (event: FocusEvent) => void>();

export class MenubarWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "checked",
      "default-open",
      "default-value",
      "loop",
      "native-composition",
      "open",
      "text-value",
    ]));
  }

  override connectedCallback() {
    super.connectedCallback();
    if (menubarPartName(this) !== "Root") return;
    this.addEventListener("mouseover", this.handleMenubarMouseOver);
    this.addEventListener("focusin", this.handleMenubarFocusIn);
    const outside = (event: PointerEvent) => {
      if (!this.getAttribute("value") || !(event.target instanceof Node) || this.contains(event.target)) return;
      dismissMenubarFromOutside(this, event.target instanceof Element ? event.target : this, "pointerdownoutside");
    };
    const outsideFocus = (event: FocusEvent) => {
      if (!this.getAttribute("value") || !(event.target instanceof Node) || this.contains(event.target)) return;
      dismissMenubarFromOutside(this, event.target instanceof Element ? event.target : this, "focusoutside");
    };
    this.ownerDocument.addEventListener("pointerdown", outside, true);
    this.ownerDocument.addEventListener("focusin", outsideFocus, true);
    outsideHandlers.set(this, outside);
    outsideFocusHandlers.set(this, outsideFocus);
    const observer = new MutationObserver(() => syncMenubarRoot(this));
    observer.observe(this, { childList: true, subtree: true });
    observers.set(this, observer);
    syncMenubarRoot(this);
  }

  disconnectedCallback() {
    if (menubarPartName(this) !== "Root") return;
    for (const content of this.querySelectorAll<HTMLElement>("aria-menubar-content, aria-menubar-sub-content")) {
      stopMenubarPositioning(menubarContentHost(content));
    }
    observers.get(this)?.disconnect();
    observers.delete(this);
    const outside = outsideHandlers.get(this);
    if (outside) this.ownerDocument.removeEventListener("pointerdown", outside, true);
    outsideHandlers.delete(this);
    const outsideFocus = outsideFocusHandlers.get(this);
    if (outsideFocus) this.ownerDocument.removeEventListener("focusin", outsideFocus, true);
    outsideFocusHandlers.delete(this);
  }

  override afterAriaWebContractApplied() {
    if (!this.isConnected) return;
    if (menubarRoot(this)) syncMenubarAround(this);
    else syncMenubarStandalone(this);
  }

  override handleAriaWebClick = (event: Event) => handleMenubarClick(this, event);
  override handleAriaWebKeyDown = (event: KeyboardEvent) => handleMenubarKeyDown(this, event);
  override handleAriaWebKeyUp = (event: KeyboardEvent) => {
    if (!menubarRoot(this) && !this.hasAttribute("disabled") && (event.key === " " || event.key === "Space" || event.key === "Spacebar")) {
      event.preventDefault();
      this.click();
    }
  };
  handleMenubarMouseOver = (event: MouseEvent) => handleMenubarMouseOver(this, event);
  handleMenubarFocusIn = (event: FocusEvent) => handleMenubarFocusIn(this, event);
}

export function createMenubarWebComponent(part: WebComponentPartSpec): typeof MenubarWebElement {
  return class extends MenubarWebElement {
    static override packageSlug = "menubar";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
