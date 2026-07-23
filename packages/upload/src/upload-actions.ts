import { acceptsFile, getErrorCallback, getSuccessCallback, revokeFile, uploadList, uploadState, type UploadFileRecord } from "./upload-state";
import { syncUpload } from "./upload-sync";

const boundRoots = new WeakSet<HTMLElement>();

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `ariaui-upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createObjectURL(file: File) {
  try { return URL.createObjectURL(file); } catch { return ""; }
}

function isSelectorDisabled(selector: Element) {
  return selector.hasAttribute("disabled") || selector.hasAttribute("is-disabled");
}

function addFiles(root: HTMLElement, files: Iterable<File>) {
  const state = uploadState(root);
  const accepted = Array.from(files).filter((file) => acceptsFile(root, file));
  for (const file of accepted) {
    state.files.push({ file, id: createId(), thumbNailUrl: createObjectURL(file), state: "PROCESSED", progress: 0, reported: false, revoked: false, xhr: null });
  }
  if (accepted.length === 0) return;
  state.rootState = "PROCESSED";
  syncUpload(root);
  root.dispatchEvent(new CustomEvent("fileschange", { bubbles: true, detail: { files: state.files.map(({ file, id, thumbNailUrl }) => ({ file, id, thumbNailUrl })) } }));
  queueMicrotask(() => {
    const auto = Array.from(root.querySelectorAll<HTMLElement>("aria-upload-auto-submit")).find((item) => item.closest("aria-upload") === root && !item.hasAttribute("disabled"));
    if (auto) submit(root, auto);
  });
}

function removeRecord(root: HTMLElement, record: UploadFileRecord) {
  const state = uploadState(root);
  state.files = state.files.filter((candidate) => candidate !== record);
  record.xhr?.abort();
  revokeFile(record);
  state.rootState = state.files.length ? "PROCESSED" : "EMPTY";
  syncUpload(root);
}

function finish(root: HTMLElement, record: UploadFileRecord, success: boolean, reason: "error" | "abort" | "status" = "error", status = 0) {
  const state = uploadState(root);
  if (record.reported || !state.files.includes(record)) return;
  record.reported = true;
  record.state = success ? "UPLOADED" : reason === "abort" ? "ABORT" : "ERROR";
  if (success) {
    record.progress = 100;
    revokeFile(record);
  }
  const list = uploadList(root);
  const file = { file: record.file, id: record.id, thumbNailUrl: record.thumbNailUrl };
  if (list) {
    if (success) getSuccessCallback(list)?.({ file, status });
    else getErrorCallback(list)?.({ file, reason, status });
  }
  if (success && state.files.every((file) => file.state === "UPLOADED")) state.rootState = "UPLOADED";
  syncUpload(root);
}

function uploadRecord(root: HTMLElement, record: UploadFileRecord, source: Element) {
  record.state = "UPLOADING";
  record.progress = 0;
  record.reported = false;
  const progress = (value: number) => { record.progress = Math.max(0, Math.min(100, Math.round(value))); syncUpload(root); };
  const resolve = (status = 200) => finish(root, record, true, "error", status);
  const reject = (reason: "error" | "abort" | "status" = "error", status = 0) => finish(root, record, false, reason, status);
  const request = new CustomEvent("uploadrequest", { bubbles: true, cancelable: true, detail: { file: record.file, id: record.id, progress, resolve, reject, source } });
  if (!root.dispatchEvent(request)) return;

  const list = uploadList(root);
  const xhr = new XMLHttpRequest();
  record.xhr = xhr;
  xhr.open((list?.getAttribute("method") ?? "POST").toUpperCase(), list?.getAttribute("url") ?? "");
  xhr.upload.addEventListener("progress", (event) => {
    const progressEvent = event as ProgressEvent;
    if (progressEvent.lengthComputable && progressEvent.total > 0) progress((progressEvent.loaded / progressEvent.total) * 100);
  });
  xhr.upload.addEventListener("abort", () => reject("abort", xhr.status));
  xhr.addEventListener("error", () => reject("error", xhr.status));
  xhr.addEventListener("loadend", () => xhr.status >= 200 && xhr.status < 300 ? resolve(xhr.status) : reject("status", xhr.status));
  const body = new FormData();
  body.append("file", record.file);
  xhr.send(body);
}

export function submit(root: HTMLElement, source: Element) {
  const state = uploadState(root);
  const pending = state.files.filter((record) => record.state === "PROCESSED");
  if (pending.length === 0) return;
  state.rootState = "UPLOADING";
  syncUpload(root);
  for (const record of pending) uploadRecord(root, record, source);
}

function clear(root: HTMLElement) {
  const state = uploadState(root);
  const records = state.files;
  state.files = [];
  state.rootState = "EMPTY";
  for (const record of records) {
    record.xhr?.abort();
    revokeFile(record);
  }
  syncUpload(root);
}

export function bindUploadRoot(root: HTMLElement) {
  if (boundRoots.has(root)) return;
  boundRoots.add(root);
  root.addEventListener("change", (event) => {
    const input = event.target;
    if (input instanceof HTMLInputElement && input.matches("input[data-upload-input]")) addFiles(root, input.files ?? []);
  });
  root.addEventListener("dragover", (event) => {
    const selector = event.target instanceof Element ? event.target.closest("aria-upload-selector") : null;
    if (selector && !isSelectorDisabled(selector)) event.preventDefault();
  });
  root.addEventListener("drop", (event) => {
    const selector = event.target instanceof Element ? event.target.closest("aria-upload-selector") : null;
    if (!selector || isSelectorDisabled(selector)) return;
    event.preventDefault();
    addFiles(root, (event as DragEvent).dataTransfer?.files ?? []);
  });
  root.addEventListener("click", (event) => {
    if (event.defaultPrevented || !(event.target instanceof Element)) return;
    const remove = event.target.closest<HTMLElement>("aria-upload-file-remove");
    if (remove) {
      const id = remove.closest<HTMLElement>("aria-upload-item")?.dataset.fileId;
      const record = uploadState(root).files.find((file) => file.id === id);
      if (record) removeRecord(root, record);
    } else if (event.target.closest("aria-upload-clear")) clear(root);
    else if (event.target.closest("aria-upload-submit")) submit(root, event.target);
  });
}

export function cleanupUpload(root: HTMLElement) {
  for (const record of uploadState(root).files) {
    record.reported = true;
    record.state = "ABORT";
    record.xhr?.abort();
    revokeFile(record);
  }
}
