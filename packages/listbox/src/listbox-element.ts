import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import {
  cleanupListboxMenu,
  handleListboxClick,
  handleListboxKeyDown,
  handleListboxMouseOver,
} from "./listbox-actions";
import { listboxMenu, listboxPartName, listboxRoot, listboxSub } from "./listbox-dom";
import { syncListboxTreeAround } from "./listbox-sync";

export class ListboxWebElement extends AriaWebElement {
  static override packageSlug = "listbox";

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "default-value",
      "defaultvalue",
      "selection-mode",
      "selectionMode",
    ]));
  }

  #hoverBound = false;
  #treeObserver: MutationObserver | undefined;

  #handleListboxMouseOver = (event: MouseEvent) => {
    handleListboxMouseOver(this, event);
  };

  override connectedCallback() {
    super.connectedCallback();
    this.bindListboxHover();
    const part = listboxPartName(this);
    const ownsTree = part === "Root" || (part === "Content" && !listboxRoot(this));
    if (ownsTree && typeof MutationObserver !== "undefined") {
      this.#treeObserver?.disconnect();
      this.#treeObserver = new MutationObserver(() => syncListboxTreeAround(this));
      this.#treeObserver.observe(this, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }
  }

  disconnectedCallback() {
    this.unbindListboxHover();
    this.#treeObserver?.disconnect();
    this.#treeObserver = undefined;
  }

  bindListboxHover() {
    const part = listboxPartName(this);
    const ownsHover = part === "Root" || (part === "Content" && !listboxRoot(this));
    if (!ownsHover || this.#hoverBound) return;
    this.addEventListener("mouseover", this.#handleListboxMouseOver);
    this.#hoverBound = true;
  }

  unbindListboxHover() {
    if (this.#hoverBound) {
      this.removeEventListener("mouseover", this.#handleListboxMouseOver);
      this.#hoverBound = false;
    }
    const part = listboxPartName(this);
    if (part === "Content" || part === "SubContent") cleanupListboxMenu(this);
  }

  override afterAriaWebContractApplied() {
    syncListboxTreeAround(this);
    const constructor = this.constructor as typeof ListboxWebElement;
    const part = listboxPartName(this);
    const ownsOptionDefaults = part === "Option" ||
      (part === "SubTrigger" && Boolean(listboxSub(this) && listboxMenu(this)));
    if (!ownsOptionDefaults) return;
    const tabindex = constructor.defaultAttributes.tabindex;
    if (tabindex && this.getAttribute("tabindex") !== tabindex) {
      this.setAttribute("tabindex", tabindex);
    }
    const popup = constructor.defaultAttributes["aria-haspopup"];
    if (popup && this.getAttribute("aria-haspopup") !== popup) {
      this.setAttribute("aria-haspopup", popup);
    }
    const expanded = constructor.defaultAttributes["aria-expanded"];
    if (expanded && !this.hasAttribute("open") && this.getAttribute("aria-expanded") !== expanded) {
      this.setAttribute("aria-expanded", expanded);
    }
  }

  override handleAriaWebClick = (event: Event) => {
    handleListboxClick(this, event);
  };

  override handleAriaWebKeyDown = (event: KeyboardEvent) => {
    handleListboxKeyDown(this, event);
  };

  override handleAriaWebKeyUp = (_event: KeyboardEvent) => {};
}

export function createListboxWebComponent(part: WebComponentPartSpec): typeof ListboxWebElement {
  return class extends ListboxWebElement {
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
