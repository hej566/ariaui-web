import {
  avatarFallbacks,
  avatarImageForwardAttributes,
  avatarImages,
  avatarPartName,
  nearestAvatarRoot,
  parseAvatarDelay,
  redispatchAvatarImageEvent,
  type AvatarImageLoadingStatus,
} from "./avatar-dom";

type AvatarSyncState = {
  imageElement: HTMLImageElement | null;
  imageStatus: AvatarImageLoadingStatus;
  fallbackTimer: number | null;
  fallbackDelayStarted: boolean;
  avatarObserver: MutationObserver | null;
  syncingConvenience: boolean;
  defaultRoleApplied: boolean;
  defaultLabelApplied: boolean;
  handleImageLoad: () => void;
  handleImageError: () => void;
};

const avatarSyncStates = new WeakMap<HTMLElement, AvatarSyncState>();

function avatarSyncState(element: HTMLElement) {
  let state = avatarSyncStates.get(element);
  if (!state) {
    state = {
      imageElement: null,
      imageStatus: "idle",
      fallbackTimer: null,
      fallbackDelayStarted: false,
      avatarObserver: null,
      syncingConvenience: false,
      defaultRoleApplied: false,
      defaultLabelApplied: false,
      handleImageLoad: () => {
        handleAvatarInternalImageStatus(element, "loaded");
        redispatchAvatarImageEvent(element, "load");
      },
      handleImageError: () => {
        handleAvatarInternalImageStatus(element, "error");
        redispatchAvatarImageEvent(element, "error");
      },
    };
    avatarSyncStates.set(element, state);
  }

  return state;
}

export function avatarLoadingStatus(element: HTMLElement) {
  return avatarSyncState(element).imageStatus;
}

export function disconnectAvatarElement(element: HTMLElement) {
  const state = avatarSyncState(element);
  state.avatarObserver?.disconnect();
  state.avatarObserver = null;
  clearAvatarFallbackTimer(element);
  unbindAvatarImageElement(element);
}

export function handleAvatarAttributeChange(element: HTMLElement, name: string) {
  if (avatarPartName(element) === "Image" && name === "src") {
    setAvatarImageStatus(element, element.hasAttribute("src") ? "loading" : "error", false);
  }
}

export function observeAvatarChildren(element: HTMLElement) {
  const state = avatarSyncState(element);
  if (typeof MutationObserver === "undefined" || state.avatarObserver || avatarPartName(element) !== "Root") {
    return;
  }

  state.avatarObserver = new MutationObserver(() => syncAvatarRoot(element));
  state.avatarObserver.observe(element, { childList: true, subtree: true });
}

export function syncAvatarPart(element: HTMLElement) {
  const partName = avatarPartName(element);

  if (partName === "Root") {
    syncAvatarRoot(element);
    return;
  }

  if (partName === "Image") {
    syncAvatarImage(element);
    return;
  }

  if (partName === "Fallback") {
    syncAvatarFallback(element);
  }
}

export function syncAvatarRoot(root: HTMLElement) {
  ensureAvatarConvenienceParts(root);
  const status = resolveAvatarRootImageStatus(root);
  applyAvatarRootSemantics(root, status);

  for (const fallback of avatarFallbacks(root)) {
    syncAvatarFallback(fallback, status);
  }
}

function ensureAvatarConvenienceParts(root: HTMLElement) {
  const state = avatarSyncState(root);
  if (state.syncingConvenience || avatarPartName(root) !== "Root") {
    return;
  }

  state.syncingConvenience = true;
  try {
    let generatedImage = root.querySelector<HTMLElement>("aria-avatar-image[data-avatar-generated='image']");

    if (root.hasAttribute("src")) {
      if (!generatedImage) {
        generatedImage = document.createElement("aria-avatar-image");
        generatedImage.setAttribute("data-avatar-generated", "image");
        root.prepend(generatedImage);
      }

      generatedImage.setAttribute("src", root.getAttribute("src") ?? "");
      generatedImage.setAttribute("alt", root.getAttribute("alt") ?? "");
      for (const attribute of avatarImageForwardAttributes) {
        if (attribute === "src" || attribute === "alt") {
          continue;
        }

        if (root.hasAttribute(attribute)) {
          generatedImage.setAttribute(attribute, root.getAttribute(attribute) ?? "");
        } else {
          generatedImage.removeAttribute(attribute);
        }
      }
    } else {
      generatedImage?.remove();
    }

    let generatedFallback = root.querySelector<HTMLElement>("aria-avatar-fallback[data-avatar-generated='fallback']");

    if (root.hasAttribute("fallback")) {
      if (!generatedFallback) {
        generatedFallback = document.createElement("aria-avatar-fallback");
        generatedFallback.setAttribute("data-avatar-generated", "fallback");
        root.append(generatedFallback);
      }

      generatedFallback.textContent = root.getAttribute("fallback") ?? "";
      if (root.hasAttribute("fallback-delay-ms")) {
        generatedFallback.setAttribute("delay-ms", root.getAttribute("fallback-delay-ms") ?? "");
      } else {
        generatedFallback.removeAttribute("delay-ms");
      }
    } else {
      generatedFallback?.remove();
    }
  } finally {
    state.syncingConvenience = false;
  }
}

export function resolveAvatarRootImageStatus(root: HTMLElement) {
  const image = avatarImages(root).find((candidate) => candidate.hasAttribute("src"));
  if (!image) {
    return "error" satisfies AvatarImageLoadingStatus;
  }

  return avatarLoadingStatus(image);
}

function applyAvatarRootSemantics(root: HTMLElement, status: AvatarImageLoadingStatus) {
  const state = avatarSyncState(root);
  const imageLoaded = status === "loaded";
  const hasVisibleFallback = root.hasAttribute("fallback") || avatarFallbacks(root).length > 0;

  if (imageLoaded || !hasVisibleFallback) {
    if (state.defaultRoleApplied && root.getAttribute("role") === "img") {
      root.removeAttribute("role");
    }
    if (state.defaultLabelApplied && root.getAttribute("aria-label") === "avatar") {
      root.removeAttribute("aria-label");
    }
    state.defaultRoleApplied = false;
    state.defaultLabelApplied = false;
    return;
  }

  if (!root.hasAttribute("role")) {
    root.setAttribute("role", "img");
    state.defaultRoleApplied = true;
  }

  if (!root.hasAttribute("aria-label")) {
    root.setAttribute("aria-label", "avatar");
    state.defaultLabelApplied = true;
  }
}

function syncAvatarImage(image: HTMLElement) {
  const state = avatarSyncState(image);
  if (!image.hasAttribute("src")) {
    unbindAvatarImageElement(image);
    image.querySelector("img")?.remove();
    setAvatarImageStatus(image, "error", false);
    notifyAvatarRoot(image);
    return;
  }

  const img = ensureAvatarImageElement(image);
  for (const attribute of avatarImageForwardAttributes) {
    if (image.hasAttribute(attribute)) {
      img.setAttribute(attribute, image.getAttribute(attribute) ?? "");
    } else {
      img.removeAttribute(attribute);
    }
  }

  if (state.imageStatus === "idle") {
    setAvatarImageStatus(image, "loading", false);
  }

  if (img.complete) {
    queueMicrotask(() => {
      if (img !== avatarSyncState(image).imageElement || !image.hasAttribute("src")) {
        return;
      }

      const status = img.naturalWidth > 0 ? "loaded" : "error";
      handleAvatarInternalImageStatus(image, status);
      redispatchAvatarImageEvent(image, status === "loaded" ? "load" : "error");
    });
  }

  applyAvatarImageVisibility(image);
  notifyAvatarRoot(image);
}

function ensureAvatarImageElement(image: HTMLElement) {
  const state = avatarSyncState(image);
  let img = state.imageElement;

  if (!img || img.parentElement !== image) {
    const existing = image.querySelector("img");
    img = existing instanceof HTMLImageElement ? existing : document.createElement("img");
    unbindAvatarImageElement(image);
    state.imageElement = img;
    img.addEventListener("load", state.handleImageLoad);
    img.addEventListener("error", state.handleImageError);

    if (!img.parentElement) {
      image.append(img);
    }
  }

  return img;
}

function unbindAvatarImageElement(image: HTMLElement) {
  const state = avatarSyncState(image);
  if (!state.imageElement) {
    return;
  }

  state.imageElement.removeEventListener("load", state.handleImageLoad);
  state.imageElement.removeEventListener("error", state.handleImageError);
  state.imageElement = null;
}

function handleAvatarInternalImageStatus(image: HTMLElement, status: AvatarImageLoadingStatus) {
  setAvatarImageStatus(image, status, true);
  applyAvatarImageVisibility(image);
  notifyAvatarRoot(image, status);
}

function setAvatarImageStatus(image: HTMLElement, status: AvatarImageLoadingStatus, emitEvent: boolean) {
  const state = avatarSyncState(image);
  if (state.imageStatus === status) {
    image.setAttribute("data-loading-status", status);
    return;
  }

  state.imageStatus = status;
  image.setAttribute("data-loading-status", status);
  if (emitEvent) {
    image.dispatchEvent(new CustomEvent("loadingstatuschange", { detail: { status } }));
  }
}

function applyAvatarImageVisibility(image: HTMLElement) {
  const img = avatarSyncState(image).imageElement;
  if (!img) {
    return;
  }

  const imageLoaded = avatarLoadingStatus(image) === "loaded";
  if (imageLoaded) {
    img.removeAttribute("aria-hidden");
    img.style.visibility = "";
  } else {
    img.setAttribute("aria-hidden", "true");
    img.style.visibility = "hidden";
  }
}

function notifyAvatarRoot(element: HTMLElement, status?: AvatarImageLoadingStatus) {
  const root = nearestAvatarRoot(element);
  if (root) {
    syncAvatarRoot(root);
  }
  if (root && status) {
    root.dispatchEvent(new CustomEvent("loadingstatuschange", { detail: { status } }));
  }
}

function syncAvatarFallback(fallback: HTMLElement, status = resolveAvatarRootImageStatus(nearestAvatarRoot(fallback) ?? fallback)) {
  const state = avatarSyncState(fallback);
  if (status === "loaded") {
    clearAvatarFallbackTimer(fallback);
    state.fallbackDelayStarted = false;
    fallback.hidden = true;
    return;
  }

  const delay = parseAvatarDelay(fallback.getAttribute("delay-ms"));
  if (delay <= 0) {
    clearAvatarFallbackTimer(fallback);
    state.fallbackDelayStarted = false;
    fallback.hidden = false;
    return;
  }

  if (state.fallbackTimer != null || (state.fallbackDelayStarted && fallback.hidden === false)) {
    return;
  }

  state.fallbackDelayStarted = true;
  fallback.hidden = true;
  state.fallbackTimer = window.setTimeout(() => {
    state.fallbackTimer = null;
    if (resolveAvatarRootImageStatus(nearestAvatarRoot(fallback) ?? fallback) !== "loaded") {
      fallback.hidden = false;
    }
  }, delay);
}

function clearAvatarFallbackTimer(fallback: HTMLElement) {
  const state = avatarSyncState(fallback);
  if (state.fallbackTimer == null) {
    return;
  }

  window.clearTimeout(state.fallbackTimer);
  state.fallbackTimer = null;
}
