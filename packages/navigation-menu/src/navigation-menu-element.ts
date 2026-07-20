import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import {
  dismissNavigationMenuFromOutside,
  handleNavigationMenuClick,
  handleNavigationMenuFocusIn,
  handleNavigationMenuKeyDown,
  handleNavigationMenuMouseOut,
  handleNavigationMenuMouseOver,
  positionCurrentNavigationMenu,
} from "./navigation-menu-actions";
import { navigationMenuContentHost, navigationMenuPartName, navigationMenuRoot } from "./navigation-menu-dom";
import { stopNavigationMenuPositioning } from "./navigation-menu-position";
import { syncNavigationMenuAround, syncNavigationMenuRoot, syncNavigationMenuStandalone } from "./navigation-menu-sync";

const observers = new WeakMap<HTMLElement, MutationObserver>();
const outsidePointerHandlers = new WeakMap<HTMLElement, (event: PointerEvent) => void>();
const outsideFocusHandlers = new WeakMap<HTMLElement, (event: FocusEvent) => void>();

export class NavigationMenuWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "active",
      "default-open",
      "defaultopen",
      "force-mount",
      "forcemount",
      "loop",
      "native-composition",
      "text-value",
      "textvalue",
    ]));
  }

  override connectedCallback() {
    super.connectedCallback();
    if (navigationMenuPartName(this) !== "Root") return;

    this.addEventListener("mouseover", this.handleNavigationMenuMouseOver);
    this.addEventListener("mouseout", this.handleNavigationMenuMouseOut);
    this.addEventListener("focusin", this.handleNavigationMenuFocusIn);

    const outsidePointer = (event: PointerEvent) => {
      if (!this.getAttribute("value") || !(event.target instanceof Node) || this.contains(event.target)) return;
      dismissNavigationMenuFromOutside(this, event.target instanceof Element ? event.target : this);
    };
    const outsideFocus = (event: FocusEvent) => {
      if (!this.getAttribute("value") || !(event.target instanceof Node) || this.contains(event.target)) return;
      dismissNavigationMenuFromOutside(this, event.target instanceof Element ? event.target : this);
    };

    this.ownerDocument.addEventListener("pointerdown", outsidePointer, true);
    this.ownerDocument.addEventListener("focusin", outsideFocus, true);
    outsidePointerHandlers.set(this, outsidePointer);
    outsideFocusHandlers.set(this, outsideFocus);

    const observer = new MutationObserver(() => {
      syncNavigationMenuRoot(this);
      positionCurrentNavigationMenu(this);
    });
    observer.observe(this, { attributes: true, childList: true, subtree: true });
    observers.set(this, observer);
    syncNavigationMenuRoot(this);
  }

  disconnectedCallback() {
    if (navigationMenuPartName(this) !== "Root") return;
    for (const content of this.querySelectorAll<HTMLElement>("aria-navigation-menu-content, aria-navigation-menu-sub-content")) {
      stopNavigationMenuPositioning(navigationMenuContentHost(content));
    }
    observers.get(this)?.disconnect();
    observers.delete(this);
    const outsidePointer = outsidePointerHandlers.get(this);
    if (outsidePointer) this.ownerDocument.removeEventListener("pointerdown", outsidePointer, true);
    outsidePointerHandlers.delete(this);
    const outsideFocus = outsideFocusHandlers.get(this);
    if (outsideFocus) this.ownerDocument.removeEventListener("focusin", outsideFocus, true);
    outsideFocusHandlers.delete(this);
  }

  override afterAriaWebContractApplied() {
    if (!this.isConnected) return;
    if (navigationMenuPartName(this) === "Root" || this.closest("aria-navigation-menu")) syncNavigationMenuAround(this);
    else syncNavigationMenuStandalone(this);
  }

  override handleAriaWebClick = (event: Event) => handleNavigationMenuClick(this, event);
  override handleAriaWebKeyDown = (event: KeyboardEvent) => handleNavigationMenuKeyDown(this, event);
  override handleAriaWebKeyUp = (event: KeyboardEvent) => {
    if (event.defaultPrevented || this.hasAttribute("disabled")) return;
    if (event.key === " " || event.key === "Space" || event.key === "Spacebar") {
      event.preventDefault();
      if (!navigationMenuRoot(this) && this.getAttribute("role") === "link") {
        this.click();
      }
    }
  };

  handleNavigationMenuMouseOver = (event: MouseEvent) => handleNavigationMenuMouseOver(this, event);
  handleNavigationMenuMouseOut = (event: MouseEvent) => handleNavigationMenuMouseOut(this, event);
  handleNavigationMenuFocusIn = (event: FocusEvent) => handleNavigationMenuFocusIn(this, event);
}

export function createNavigationMenuWebComponent(part: WebComponentPartSpec): typeof NavigationMenuWebElement {
  return class extends NavigationMenuWebElement {
    static override packageSlug = "navigation-menu";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
