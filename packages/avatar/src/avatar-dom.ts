export type AvatarImageLoadingStatus = "idle" | "loading" | "loaded" | "error";

export const avatarImageForwardAttributes = [
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

export const avatarObservedAttributes = [
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
] as const;

export function avatarPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function nearestAvatarRoot(element: Element) {
  return element.closest("aria-avatar") as HTMLElement | null;
}

export function avatarImages(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-avatar-image"));
}

export function avatarFallbacks(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-avatar-fallback"));
}

export function parseAvatarDelay(value: string | null) {
  if (value == null || value.trim() === "") {
    return 0;
  }

  const delay = Number(value);
  return Number.isFinite(delay) && delay > 0 ? delay : 0;
}

export function redispatchAvatarImageEvent(host: HTMLElement, type: "load" | "error") {
  host.dispatchEvent(new Event(type));
}
