import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { closeRootContextMenu, handleContextMenuClick, handleContextMenuKeyDown, handleContextMenuKeyUp, handleContextMenuMouseOver, openRootContextMenu } from "./context-menu-actions";
import { contextMenuArea, contextMenuPartName } from "./context-menu-dom";
import { syncContextMenuStandalonePart, syncContextMenuTreeFromRoot } from "./context-menu-sync";

const rootObservers = new WeakMap<HTMLElement, MutationObserver>();
const rootAreaBindings = new WeakMap<HTMLElement, { area: HTMLElement; listener: (event: MouseEvent) => void }>();
const rootOutsideHandlers = new WeakMap<HTMLElement, (event: MouseEvent) => void>();
const rootHoverHandlers = new WeakMap<HTMLElement, (event: MouseEvent) => void>();

function isRoot(element: HTMLElement) {
  return contextMenuPartName(element) === "Root";
}

function unbindContextMenuArea(root: HTMLElement) {
  const binding = rootAreaBindings.get(root);
  if (!binding) return;
  binding.area.removeEventListener("contextmenu", binding.listener);
  rootAreaBindings.delete(root);
}

function bindOutsideHandler(root: HTMLElement) {
  if (rootOutsideHandlers.has(root)) return;
  const handler = (event: MouseEvent) => {
    if (!root.hasAttribute("open") || !(event.target instanceof Node)) return;
    const area = contextMenuArea(root);
    if (root.contains(event.target) || area?.contains(event.target)) return;
    closeRootContextMenu(root, event.target instanceof Element ? event.target : root);
  };
  root.ownerDocument.addEventListener("click", handler, true);
  rootOutsideHandlers.set(root, handler);
}

function unbindOutsideHandler(root: HTMLElement) {
  const handler = rootOutsideHandlers.get(root);
  if (!handler) return;
  root.ownerDocument.removeEventListener("click", handler, true);
  rootOutsideHandlers.delete(root);
}

function bindHoverHandler(root: HTMLElement) {
  if (rootHoverHandlers.has(root)) return;
  const handler = (event: MouseEvent) => handleContextMenuMouseOver(root, event);
  root.addEventListener("mouseover", handler);
  rootHoverHandlers.set(root, handler);
}

function unbindHoverHandler(root: HTMLElement) {
  const handler = rootHoverHandlers.get(root);
  if (!handler) return;
  root.removeEventListener("mouseover", handler);
  rootHoverHandlers.delete(root);
}

export class ContextMenuWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "area",
      "area-id",
      "default-open",
      "defaultopen",
      "for",
      "offset",
    ]));
  }

  override get open() {
    return this.hasAttribute("open");
  }

  override set open(value: boolean) {
    const next = Boolean(value);
    if (this.hasAttribute("open") === next) {
      if (isRoot(this)) {
        syncContextMenuTreeFromRoot(this);
      } else {
        syncContextMenuStandalonePart(this);
      }
      return;
    }
    this.toggleAttribute("open", next);
  }

  bindContextMenuArea = () => {
    if (!isRoot(this)) return;
    const area = contextMenuArea(this);
    const existing = rootAreaBindings.get(this);
    if (existing?.area === area) return;

    unbindContextMenuArea(this);
    if (!area) return;

    const listener = (event: MouseEvent) => {
      event.preventDefault();
      openRootContextMenu(this, { x: event.clientX, y: event.clientY }, area);
    };
    area.addEventListener("contextmenu", listener);
    rootAreaBindings.set(this, { area, listener });
  };

  syncContextMenuTreeFromRoot = () => {
    syncContextMenuTreeFromRoot(this);
  };

  override connectedCallback() {
    super.connectedCallback();
    if (!isRoot(this)) return;

    this.bindContextMenuArea();
    bindOutsideHandler(this);
    bindHoverHandler(this);

    if (!rootObservers.has(this)) {
      const observer = new MutationObserver(() => {
        this.bindContextMenuArea();
        this.syncContextMenuTreeFromRoot();
      });
      observer.observe(this, {
        attributes: true,
        attributeFilter: ["area", "area-id", "for", "id", "offset", "open"],
        childList: true,
        subtree: true,
      });
      rootObservers.set(this, observer);
    }
  }

  disconnectedCallback() {
    if (!isRoot(this)) return;
    rootObservers.get(this)?.disconnect();
    rootObservers.delete(this);
    unbindContextMenuArea(this);
    unbindOutsideHandler(this);
    unbindHoverHandler(this);
  }

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (isRoot(this) && (name === "area" || name === "area-id" || name === "for")) {
      this.bindContextMenuArea();
    }
  }

  override afterAriaWebContractApplied() {
    if (isRoot(this)) {
      syncContextMenuTreeFromRoot(this);
      return;
    }

    syncContextMenuStandalonePart(this);
  }

  override handleAriaWebClick = (event: Event) => {
    handleContextMenuClick(this, event);
  };

  override handleAriaWebKeyDown = (event: KeyboardEvent) => {
    handleContextMenuKeyDown(this, event);
  };

  override handleAriaWebKeyUp = (event: KeyboardEvent) => {
    handleContextMenuKeyUp(this, event);
  };
}

export function createContextMenuWebComponent(part: WebComponentPartSpec): typeof ContextMenuWebElement {
  return class extends ContextMenuWebElement {
    static override packageSlug = "context-menu";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
