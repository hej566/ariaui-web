import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

function partAttribute(partName: string) {
  return partName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

const tableObservers = new WeakMap<HTMLElement, MutationObserver>();
const generatedLabels = new WeakMap<HTMLElement, string>();
let captionId = 0;

function tableRoot(element: HTMLElement) {
  if (element.localName === "aria-table") return element;
  return element.closest<HTMLElement>("aria-table");
}

function syncCaptionName(root: HTMLElement) {
  const generatedLabel = generatedLabels.get(root);
  const currentLabel = root.getAttribute("aria-labelledby");
  if (root.hasAttribute("aria-label")) {
    if (generatedLabel && currentLabel === generatedLabel) root.removeAttribute("aria-labelledby");
    generatedLabels.delete(root);
    return;
  }
  if (currentLabel != null && currentLabel !== generatedLabel) return;

  const caption = Array.from(root.querySelectorAll<HTMLElement>("aria-table-caption"))
    .find((candidate) => tableRoot(candidate) === root);
  if (!caption) {
    if (generatedLabel && currentLabel === generatedLabel) root.removeAttribute("aria-labelledby");
    generatedLabels.delete(root);
    return;
  }

  if (!caption.id) caption.id = `aria-table-caption-${++captionId}`;
  generatedLabels.set(root, caption.id);
  if (currentLabel !== caption.id) root.setAttribute("aria-labelledby", caption.id);
}

export class TableWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return [...super.observedAttributes, "aria-label", "scope"];
  }

  override connectedCallback() {
    this.applyAriaWebContract();
    const root = tableRoot(this);
    if (!root) return;

    if (root === this && !tableObservers.has(root)) {
      const observer = new MutationObserver(() => syncCaptionName(root));
      observer.observe(root, { childList: true, subtree: true });
      tableObservers.set(root, observer);
    }
    syncCaptionName(root);
  }

  disconnectedCallback() {
    const observer = tableObservers.get(this);
    observer?.disconnect();
    tableObservers.delete(this);
  }

  override applyAriaWebContract() {
    const constructor = this.constructor as typeof TableWebElement;
    this.setAttribute("data-ariaui-web", "table");
    this.setAttribute("data-package", "table");
    this.setAttribute("data-part", constructor.partName);

    if (!this.hasAttribute("part")) {
      this.setAttribute("part", partAttribute(constructor.partName));
    }
    for (const [attribute, value] of Object.entries(constructor.defaultAttributes)) {
      if (!this.hasAttribute(attribute)) this.setAttribute(attribute, value);
    }
    if (constructor.defaultRole && !this.hasAttribute("role")) {
      this.setAttribute("role", constructor.defaultRole);
    }

    if (constructor.partName === "Root") {
      this.style.position = "relative";
      this.style.width = "100%";
      this.style.overflow = "auto";
    }
    if (constructor.partName === "RowHeader" && !this.hasAttribute("scope")) {
      this.setAttribute("scope", "row");
    }
  }

  override afterAriaWebContractApplied() {
    const root = tableRoot(this);
    if (root) syncCaptionName(root);
  }
}

export function createTableWebComponent(part: WebComponentPartSpec): typeof TableWebElement {
  return class extends TableWebElement {
    static override packageSlug = "table";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
