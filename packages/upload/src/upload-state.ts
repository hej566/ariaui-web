export type UploadFileState = "PROCESSED" | "UPLOADING" | "UPLOADED" | "ERROR" | "ABORT";
export type UploadRootState = "EMPTY" | "PROCESSED" | "UPLOADING" | "UPLOADED";

export type UploadFileRecord = {
  file: File;
  id: string;
  thumbNailUrl: string;
  state: UploadFileState;
  progress: number;
  reported: boolean;
  revoked: boolean;
  xhr: XMLHttpRequest | null;
};

type UploadState = {
  files: UploadFileRecord[];
  observer: MutationObserver | null;
  rootState: UploadRootState;
  syncing: boolean;
};

const states = new WeakMap<HTMLElement, UploadState>();
const errorCallbacks = new WeakMap<HTMLElement, ((payload: unknown) => void) | null>();
const successCallbacks = new WeakMap<HTMLElement, ((payload: unknown) => void) | null>();

export function uploadState(root: HTMLElement) {
  let state = states.get(root);
  if (!state) {
    state = { files: [], observer: null, rootState: "EMPTY", syncing: false };
    states.set(root, state);
  }
  return state;
}

export function uploadRoot(element: Element | null) {
  return element?.matches("aria-upload") ? element as HTMLElement : element?.closest<HTMLElement>("aria-upload") ?? null;
}

export function uploadPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function uploadList(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-upload-list")).find((list) => list.closest("aria-upload") === root) ?? null;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1_000) return `${bytes} bytes`;
  if (bytes < 1_000_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  if (bytes < 1_000_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
}

export function fileExtension(name: string, fallback = "file", maxLength = 4) {
  const extension = name.split(".").pop();
  return !extension || extension === name ? fallback : extension.slice(0, maxLength);
}

export function formats(root: Element) {
  return (root.getAttribute("format") ?? "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
}

export function acceptsFile(root: Element, file: File) {
  const accepted = formats(root);
  if (accepted.length === 0) return true;
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return accepted.some((format) => type.includes(format) || name.endsWith(`.${format}`));
}

export function revokeFile(record: UploadFileRecord) {
  if (record.revoked || !record.thumbNailUrl) return;
  URL.revokeObjectURL(record.thumbNailUrl);
  record.revoked = true;
}

export function getErrorCallback(list: HTMLElement) { return errorCallbacks.get(list) ?? null; }
export function setErrorCallback(list: HTMLElement, value: ((payload: unknown) => void) | null) { errorCallbacks.set(list, value); }
export function getSuccessCallback(list: HTMLElement) { return successCallbacks.get(list) ?? null; }
export function setSuccessCallback(list: HTMLElement, value: ((payload: unknown) => void) | null) { successCallbacks.set(list, value); }
