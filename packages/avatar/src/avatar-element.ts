import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export type AvatarImageLoadingStatus = "idle" | "loading" | "loaded" | "error";

const imageForwardAttributes = [
  "alt",
  "crossorigin",
  "data-testid",
  "decoding",
  "fetchpriority",
  "loading",
  "referrerpolicy",
  "sizes",
  "src",
  "srcset",
] as const;

function avatarPartName(element: AvatarWebElement) {
  return (element.constructor as typeof AvatarWebElement).partName;
}

function nearestAvatarRoot(element: Element) {
  return element.closest("aria-avatar") as AvatarWebElement | null;
}

function avatarImages(root: Element) {
  return Array.from(root.querySelectorAll("aria-avatar-image")) as AvatarWebElement[];
}

function avatarFallbacks(root: Element) {
  return Array.from(root.querySelectorAll("aria-avatar-fallback")) as AvatarWebElement[];
}

function parseDelay(value: string | null) {
  if (value == null || value.trim() === "") {
    return 0;
  }

  const delay = Number(value);
  return Number.isFinite(delay) && delay > 0 ? delay : 0;
}

function redispatchImageEvent(host: AvatarWebElement, type: "load" | "error") {
  host.dispatchEvent(new Event(type));
}

export class AvatarWebElement extends AriaWebElement {
  #imageElement: HTMLImageElement | null = null;
  #imageStatus: AvatarImageLoadingStatus = "idle";
  #fallbackTimer: number | null = null;
  #fallbackDelayStarted = false;
  #avatarObserver: MutationObserver | null = null;
  #syncingConvenience = false;
  #defaultRoleApplied = false;
  #defaultLabelApplied = false;

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "alt",
      "aria-label",
      "crossorigin",
      "data-testid",
      "decoding",
      "delay-ms",
      "fallback",
      "fallback-delay-ms",
      "fetchpriority",
      "loading",
      "referrerpolicy",
      "role",
      "sizes",
      "src",
      "srcset",
    ]));
  }

  get src() {
    return this.getAttribute("src") ?? "";
  }

  set src(value: string | null | undefined) {
    if (value == null || value === "") {
      this.removeAttribute("src");
    } else {
      this.setAttribute("src", String(value));
    }
  }

  get loadingStatus() {
    return this.#imageStatus;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.observeAvatarChildren();
    this.syncAvatarPart();
  }

  disconnectedCallback() {
    this.#avatarObserver?.disconnect();
    this.#avatarObserver = null;
    this.clearFallbackTimer();
    this.unbindImageElement();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (oldValue === newValue) {
      return;
    }

    if (avatarPartName(this) === "Image" && name === "src") {
      this.setImageStatus(this.hasAttribute("src") ? "loading" : "error", false);
    }

    this.syncAvatarPart();
  }

  override afterAriaWebContractApplied() {
    this.syncAvatarPart();
  }

  observeAvatarChildren() {
    if (typeof MutationObserver === "undefined" || this.#avatarObserver || avatarPartName(this) !== "Root") {
      return;
    }

    this.#avatarObserver = new MutationObserver(() => this.syncRoot());
    this.#avatarObserver.observe(this, { childList: true, subtree: true });
  }

  syncAvatarPart() {
    const partName = avatarPartName(this);

    if (partName === "Root") {
      this.syncRoot();
      return;
    }

    if (partName === "Image") {
      this.syncImage();
      return;
    }

    if (partName === "Fallback") {
      this.syncFallback();
    }
  }

  syncRoot() {
    this.ensureConvenienceParts();
    const status = this.resolveRootImageStatus();
    this.applyRootSemantics(status);

    for (const fallback of avatarFallbacks(this)) {
      if (typeof fallback.syncFallback === "function") {
        fallback.syncFallback(status);
      } else {
        fallback.hidden = status === "loaded";
      }
    }
  }

  ensureConvenienceParts() {
    if (this.#syncingConvenience || avatarPartName(this) !== "Root") {
      return;
    }

    this.#syncingConvenience = true;
    try {
      let generatedImage = this.querySelector("aria-avatar-image[data-avatar-generated='image']") as AvatarWebElement | null;

      if (this.hasAttribute("src")) {
        if (!generatedImage) {
          generatedImage = document.createElement("aria-avatar-image") as AvatarWebElement;
          generatedImage.setAttribute("data-avatar-generated", "image");
          this.prepend(generatedImage);
        }

        generatedImage.setAttribute("src", this.getAttribute("src") ?? "");
        generatedImage.setAttribute("alt", this.getAttribute("alt") ?? "");
        for (const attribute of imageForwardAttributes) {
          if (attribute === "src" || attribute === "alt") {
            continue;
          }

          if (this.hasAttribute(attribute)) {
            generatedImage.setAttribute(attribute, this.getAttribute(attribute) ?? "");
          } else {
            generatedImage.removeAttribute(attribute);
          }
        }
      } else {
        generatedImage?.remove();
      }

      let generatedFallback = this.querySelector("aria-avatar-fallback[data-avatar-generated='fallback']") as AvatarWebElement | null;

      if (this.hasAttribute("fallback")) {
        if (!generatedFallback) {
          generatedFallback = document.createElement("aria-avatar-fallback") as AvatarWebElement;
          generatedFallback.setAttribute("data-avatar-generated", "fallback");
          this.append(generatedFallback);
        }

        generatedFallback.textContent = this.getAttribute("fallback") ?? "";
        if (this.hasAttribute("fallback-delay-ms")) {
          generatedFallback.setAttribute("delay-ms", this.getAttribute("fallback-delay-ms") ?? "");
        } else {
          generatedFallback.removeAttribute("delay-ms");
        }
      } else {
        generatedFallback?.remove();
      }
    } finally {
      this.#syncingConvenience = false;
    }
  }

  resolveRootImageStatus() {
    const image = avatarImages(this).find((candidate) => candidate.hasAttribute("src"));
    if (!image) {
      return "error" satisfies AvatarImageLoadingStatus;
    }

    return image.loadingStatus;
  }

  applyRootSemantics(status: AvatarImageLoadingStatus) {
    const imageLoaded = status === "loaded";
    const hasVisibleFallback = this.hasAttribute("fallback") || avatarFallbacks(this).length > 0;

    if (imageLoaded || !hasVisibleFallback) {
      if (this.#defaultRoleApplied && this.getAttribute("role") === "img") {
        this.removeAttribute("role");
      }
      if (this.#defaultLabelApplied && this.getAttribute("aria-label") === "avatar") {
        this.removeAttribute("aria-label");
      }
      this.#defaultRoleApplied = false;
      this.#defaultLabelApplied = false;
      return;
    }

    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "img");
      this.#defaultRoleApplied = true;
    }

    if (!this.hasAttribute("aria-label")) {
      this.setAttribute("aria-label", "avatar");
      this.#defaultLabelApplied = true;
    }
  }

  syncImage() {
    if (!this.hasAttribute("src")) {
      this.unbindImageElement();
      this.querySelector("img")?.remove();
      this.setImageStatus("error", false);
      this.notifyRoot();
      return;
    }

    const img = this.ensureImageElement();
    for (const attribute of imageForwardAttributes) {
      if (this.hasAttribute(attribute)) {
        img.setAttribute(attribute, this.getAttribute(attribute) ?? "");
      } else {
        img.removeAttribute(attribute);
      }
    }

    if (this.#imageStatus === "idle") {
      this.setImageStatus("loading", false);
    }

    if (img.complete) {
      queueMicrotask(() => {
        if (img !== this.#imageElement || !this.hasAttribute("src")) {
          return;
        }

        const status = img.naturalWidth > 0 ? "loaded" : "error";
        this.handleInternalImageStatus(status);
        redispatchImageEvent(this, status === "loaded" ? "load" : "error");
      });
    }

    this.applyImageVisibility();
    this.notifyRoot();
  }

  ensureImageElement() {
    let img = this.#imageElement;

    if (!img || img.parentElement !== this) {
      const existing = this.querySelector("img");
      img = existing instanceof HTMLImageElement ? existing : document.createElement("img");
      this.unbindImageElement();
      this.#imageElement = img;
      img.addEventListener("load", this.handleInternalImageLoad);
      img.addEventListener("error", this.handleInternalImageError);

      if (!img.parentElement) {
        this.append(img);
      }
    }

    return img;
  }

  unbindImageElement() {
    if (!this.#imageElement) {
      return;
    }

    this.#imageElement.removeEventListener("load", this.handleInternalImageLoad);
    this.#imageElement.removeEventListener("error", this.handleInternalImageError);
    this.#imageElement = null;
  }

  handleInternalImageLoad = () => {
    this.handleInternalImageStatus("loaded");
    redispatchImageEvent(this, "load");
  };

  handleInternalImageError = () => {
    this.handleInternalImageStatus("error");
    redispatchImageEvent(this, "error");
  };

  handleInternalImageStatus(status: AvatarImageLoadingStatus) {
    this.setImageStatus(status, true);
    this.applyImageVisibility();
    this.notifyRoot(status);
  }

  setImageStatus(status: AvatarImageLoadingStatus, emitEvent: boolean) {
    if (this.#imageStatus === status) {
      this.setAttribute("data-loading-status", status);
      return;
    }

    this.#imageStatus = status;
    this.setAttribute("data-loading-status", status);
    if (emitEvent) {
      this.dispatchEvent(new CustomEvent("loadingstatuschange", { detail: { status } }));
    }
  }

  applyImageVisibility() {
    const img = this.#imageElement;
    if (!img) {
      return;
    }

    const imageLoaded = this.#imageStatus === "loaded";
    if (imageLoaded) {
      img.removeAttribute("aria-hidden");
      img.style.visibility = "";
    } else {
      img.setAttribute("aria-hidden", "true");
      img.style.visibility = "hidden";
    }
  }

  notifyRoot(status?: AvatarImageLoadingStatus) {
    const root = nearestAvatarRoot(this);
    root?.syncRoot();
    if (root && status) {
      root.dispatchEvent(new CustomEvent("loadingstatuschange", { detail: { status } }));
    }
  }

  syncFallback(status = nearestAvatarRoot(this)?.resolveRootImageStatus() ?? "error") {
    if (status === "loaded") {
      this.clearFallbackTimer();
      this.#fallbackDelayStarted = false;
      this.hidden = true;
      return;
    }

    const delay = parseDelay(this.getAttribute("delay-ms"));
    if (delay <= 0) {
      this.clearFallbackTimer();
      this.#fallbackDelayStarted = false;
      this.hidden = false;
      return;
    }

    if (this.#fallbackTimer != null || (this.#fallbackDelayStarted && this.hidden === false)) {
      return;
    }

    this.#fallbackDelayStarted = true;
    this.hidden = true;
    this.#fallbackTimer = window.setTimeout(() => {
      this.#fallbackTimer = null;
      if ((nearestAvatarRoot(this)?.resolveRootImageStatus() ?? "error") !== "loaded") {
        this.hidden = false;
      }
    }, delay);
  }

  clearFallbackTimer() {
    if (this.#fallbackTimer == null) {
      return;
    }

    window.clearTimeout(this.#fallbackTimer);
    this.#fallbackTimer = null;
  }
}

export function createAvatarWebComponent(part: WebComponentPartSpec): typeof AvatarWebElement {
  return class extends AvatarWebElement {
    static override packageSlug = "avatar";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
