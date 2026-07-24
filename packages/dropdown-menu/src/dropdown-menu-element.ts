import { AriaWebElement } from "@ariaui-web/utils";
import { createPortalElement } from "@ariaui-web/portal";
import {
  handleDropdownMenuClick,
  handleDropdownMenuKeyDown,
  handleDropdownMenuKeyUp,
  handleDropdownMenuMouseOver,
} from "./dropdown-menu-actions";
import {
  dropdownMenuPartName,
  dropdownMenuRoot,
  dropdownMenuSub,
  registerDropdownMenuRootContent,
  registerDropdownMenuSubContent,
} from "./dropdown-menu-dom";
import { syncDropdownMenuTreeAround } from "./dropdown-menu-sync";

const dropdownMenuPortalHosts = new WeakMap<HTMLElement, HTMLElement>();
let dropdownMenuPortalId = 0;

export class DropdownMenuElement extends AriaWebElement {
  static override packageSlug = "dropdown-menu";

  override connectedCallback() {
    super.connectedCallback();
    const partName = dropdownMenuPartName(this);
    if (partName === "Content" || partName === "SubContent") {
      this.portalDropdownMenuContent(partName);
      this.addEventListener("mouseover", this.#handleDropdownMenuMouseOver);
    }
  }

  disconnectedCallback() {
    const partName = dropdownMenuPartName(this);
    if (partName === "Content" || partName === "SubContent") {
      this.removeEventListener("mouseover", this.#handleDropdownMenuMouseOver);
    }
  }

  override afterAriaWebContractApplied() {
    syncDropdownMenuTreeAround(this);
  }

  override handleAriaWebClick = (event: Event) => {
    handleDropdownMenuClick(this, event);
  };

  override handleAriaWebKeyDown = (event: KeyboardEvent) => {
    handleDropdownMenuKeyDown(this, event);
  };

  override handleAriaWebKeyUp = (event: KeyboardEvent) => {
    handleDropdownMenuKeyUp(this, event);
  };

  #handleDropdownMenuMouseOver = (event: MouseEvent) => {
    const root = dropdownMenuRoot(this);
    if (root instanceof HTMLElement) {
      handleDropdownMenuMouseOver(root, event);
    }
  };

  private portalDropdownMenuContent(partName: "Content" | "SubContent") {
    if (dropdownMenuPortalHosts.has(this)) {
      return;
    }

    const root = dropdownMenuRoot(this);
    if (!(root instanceof HTMLElement)) {
      return;
    }

    let owner: HTMLElement;
    if (partName === "Content") {
      registerDropdownMenuRootContent(root, this);
      owner = root;
    } else {
      const sub = dropdownMenuSub(this);
      if (!(sub instanceof HTMLElement)) {
        return;
      }
      registerDropdownMenuSubContent(root, sub, this);
      owner = sub;
    }

    const portalKind = partName === "Content" ? "content" : "sub-content";
    const portal = owner.querySelector<HTMLElement>(`:scope > aria-portal[data-dropdown-menu-portal="${portalKind}"]`)
      ?? createPortalElement();
    if (!this.id) {
      dropdownMenuPortalId += 1;
      this.id = `ariaui-dropdown-menu-${portalKind}-portal-${dropdownMenuPortalId}`;
    }
    portal.setAttribute("data-dropdown-menu-portal", portalKind);
    portal.setAttribute("data-dropdown-menu-portal-content", this.id);
    dropdownMenuPortalHosts.set(this, portal);
    if (!portal.isConnected) {
      this.before(portal);
    }
    portal.append(this);
  }
}
