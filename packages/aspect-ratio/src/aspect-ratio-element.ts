import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

const fallbackRatio = 1;

function resolveRatioPair(value: string, separator: "/" | ":") {
  const pattern = separator === "/"
    ? /^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/
    : /^(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)$/;
  const match = value.match(pattern);
  if (!match) {
    return null;
  }

  const [widthValue, heightValue] = match.slice(1);
  if (!widthValue || !heightValue) {
    return null;
  }

  const width = Number.parseFloat(widthValue);
  const height = Number.parseFloat(heightValue);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }

  return width / height;
}

function resolveNumericRatio(value: string) {
  if (!/^\d+(?:\.\d+)?$/.test(value)) {
    return null;
  }

  const ratio = Number.parseFloat(value);
  return Number.isFinite(ratio) && ratio > 0 ? ratio : null;
}

export function resolveAspectRatio(ratio: number | string | null | undefined) {
  if (ratio == null) {
    return fallbackRatio;
  }

  if (typeof ratio === "number") {
    return Number.isFinite(ratio) && ratio > 0 ? ratio : fallbackRatio;
  }

  const value = String(ratio).trim();
  if (!value) {
    return fallbackRatio;
  }

  return resolveRatioPair(value, "/")
    ?? resolveRatioPair(value, ":")
    ?? resolveNumericRatio(value)
    ?? fallbackRatio;
}

function applyShellStyles(element: HTMLElement, ratio: number) {
  element.style.display = "block";
  element.style.position = "relative";
  element.style.width = "100%";
  element.style.paddingBottom = String((1 / ratio) * 100) + "%";
}

function applyFillStyles(element: HTMLElement) {
  element.style.position = "absolute";
  element.style.inset = "0px";
}

export class AspectRatioWebElement extends AriaWebElement {
  #fillElement: HTMLElement | null = null;
  #observer: MutationObserver | null = null;
  #syncing = false;

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
    this.observeAspectRatioChildren();
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#observer = null;
  }

  override afterAriaWebContractApplied() {
    this.syncAspectRatioLayout();
  }

  observeAspectRatioChildren() {
    if (typeof MutationObserver === "undefined" || this.#observer) {
      return;
    }

    this.#observer = new MutationObserver(() => {
      if (!this.#syncing) {
        this.syncAspectRatioLayout();
      }
    });
    this.#observer.observe(this, { childList: true });
  }

  firstElementFillHost() {
    return Array.from(this.children).find((child): child is HTMLElement => child instanceof HTMLElement && child !== this.#fillElement) ?? null;
  }

  removeInternalFill() {
    const fill = this.#fillElement;
    if (!fill || fill.parentElement !== this) {
      this.#fillElement = null;
      return;
    }

    while (fill.firstChild) {
      this.insertBefore(fill.firstChild, fill);
    }
    fill.remove();
    this.#fillElement = null;
  }

  ensureInternalFill() {
    if (!this.#fillElement || this.#fillElement.parentElement !== this) {
      this.#fillElement = document.createElement("div");
      this.append(this.#fillElement);
    }

    return this.#fillElement;
  }

  moveChildrenIntoFill(fill: HTMLElement) {
    for (const node of Array.from(this.childNodes)) {
      if (node !== fill) {
        fill.append(node);
      }
    }
  }

  syncAspectRatioLayout() {
    if (this.#syncing) {
      return;
    }

    this.#syncing = true;
    try {
      applyShellStyles(this, resolveAspectRatio(this.getAttribute("ratio") ?? undefined));

      if (this.hasAttribute("native-composition")) {
        this.removeInternalFill();
        const fillHost = this.firstElementFillHost();
        if (fillHost) {
          applyFillStyles(fillHost);
        }
        return;
      }

      const fill = this.ensureInternalFill();
      this.moveChildrenIntoFill(fill);
      applyFillStyles(fill);
    } finally {
      this.#syncing = false;
    }
  }
}

export function createAspectRatioWebComponent(part: WebComponentPartSpec): typeof AspectRatioWebElement {
  return class extends AspectRatioWebElement {
    static override packageSlug = "aspect-ratio";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
