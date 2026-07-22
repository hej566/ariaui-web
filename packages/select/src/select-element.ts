import { AriaWebElement } from "@ariaui-web/utils";
import { createPortalElement } from "@ariaui-web/portal";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import {
  bindSelectOutsideEvents,
  handleSelectClick,
  handleSelectKeyDown,
  handleSelectMouseOver,
  unbindSelectOutsideEvents,
} from "./select-actions";
import { syncSelectTreeAround } from "./select-sync";
import {
  registerSelectRootContent,
  registerSelectSubContent,
  selectRoot,
  selectSub,
} from "./select-dom";

const selectPortalHosts = new WeakMap<HTMLElement, HTMLElement>();
let selectPortalId = 0;

export class SelectWebElement extends AriaWebElement {
  static override packageSlug = "select";

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "default-open",
      "defaultopen",
      "selection-mode",
      "selectionMode",
    ]));
  }

  override connectedCallback() {
    super.connectedCallback();
    const partName = (this.constructor as typeof SelectWebElement).partName;
    if (partName === "Root") {
      bindSelectOutsideEvents(this);
    }
    if (partName === "Content" || partName === "SubContent") {
      this.portalSelectContent(partName);
      this.addEventListener("mouseover", this.#handleSelectMouseOver);
    }
  }

  disconnectedCallback() {
    const partName = (this.constructor as typeof SelectWebElement).partName;
    if (partName === "Root") {
      unbindSelectOutsideEvents(this);
    }
    if (partName === "Content" || partName === "SubContent") {
      this.removeEventListener("mouseover", this.#handleSelectMouseOver);
    }
  }

  override afterAriaWebContractApplied() {
    syncSelectTreeAround(this);
  }

  override handleAriaWebClick = (event: Event) => {
    handleSelectClick(this, event);
  };

  override handleAriaWebKeyDown = (event: KeyboardEvent) => {
    handleSelectKeyDown(this, event);
  };

  #handleSelectMouseOver = (event: MouseEvent) => {
    const root = selectRoot(this);
    if (root instanceof HTMLElement) {
      handleSelectMouseOver(root, event);
    }
  };

  private portalSelectContent(partName: "Content" | "SubContent") {
    if (selectPortalHosts.has(this)) {
      return;
    }

    const root = selectRoot(this);
    if (!(root instanceof HTMLElement)) {
      return;
    }

    if (partName === "Content") {
      registerSelectRootContent(root, this);
    } else {
      const sub = selectSub(this);
      if (!(sub instanceof HTMLElement)) {
        return;
      }
      registerSelectSubContent(root, sub, this);
    }

    const portal = createPortalElement();
    if (!this.id) {
      selectPortalId += 1;
      this.id = `ariaui-select-${partName === "Content" ? "content" : "sub-content"}-portal-${selectPortalId}`;
    }
    portal.setAttribute("data-select-portal", partName === "Content" ? "content" : "sub-content");
    portal.setAttribute("data-select-portal-content", this.id);
    selectPortalHosts.set(this, portal);
    this.before(portal);
    portal.append(this);
  }
}

export function createSelectWebComponent(part: WebComponentPartSpec): typeof SelectWebElement {
  return class extends SelectWebElement {
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
