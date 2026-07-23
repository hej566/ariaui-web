import { fileExtension, formatFileSize, uploadList, uploadRoot, uploadState, type UploadFileRecord } from "./upload-state";

function setAttribute(element: Element, name: string, value: string | null) {
  if (value === null) {
    if (element.hasAttribute(name)) element.removeAttribute(name);
  } else if (element.getAttribute(name) !== value) element.setAttribute(name, value);
}

function setText(element: HTMLElement | null, value: string) {
  if (element && element.textContent !== value) element.textContent = value;
}

function makePart(tag: string, className?: string) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return element;
}

function renderItem(record: UploadFileRecord) {
  const item = makePart("aria-upload-item");
  item.setAttribute("data-upload-generated", "");
  item.setAttribute("data-file-id", record.id);

  const extension = makePart("aria-upload-file-extension");
  const meta = document.createElement("div");
  meta.setAttribute("data-upload-item-meta", "");
  const header = document.createElement("div");
  header.setAttribute("data-upload-item-header", "");
  const name = makePart("aria-upload-file-name");
  const status = makePart("aria-upload-file-status");
  const size = makePart("aria-upload-file-size");
  const progress = makePart("aria-upload-file-progress");
  const indicator = document.createElement("span");
  indicator.setAttribute("data-upload-progress-indicator", "");
  progress.append(indicator);
  const remove = makePart("aria-upload-file-remove");
  remove.setAttribute("aria-label", `Remove ${record.file.name}`);
  remove.textContent = "×";
  header.append(name, status);
  meta.append(header, size, progress);
  item.append(extension, meta, remove);
  return item;
}

function statusText(record: UploadFileRecord) {
  if (record.state === "UPLOADING") return `${record.progress}%`;
  return { PROCESSED: "Ready", UPLOADED: "Done", ERROR: "Failed", ABORT: "Canceled" }[record.state];
}

function syncItem(item: HTMLElement, record: UploadFileRecord) {
  const state = record.state.toLowerCase();
  const value = record.state === "UPLOADED" ? 100 : record.state === "UPLOADING" ? record.progress : 0;
  setAttribute(item, "data-state", state);
  setAttribute(item, "data-progress", String(record.progress));
  const name = item.querySelector<HTMLElement>("aria-upload-file-name");
  const size = item.querySelector<HTMLElement>("aria-upload-file-size");
  const extension = item.querySelector<HTMLElement>("aria-upload-file-extension");
  const status = item.querySelector<HTMLElement>("aria-upload-file-status");
  const progress = item.querySelector<HTMLElement>("aria-upload-file-progress");
  const remove = item.querySelector<HTMLElement>("aria-upload-file-remove");
  setText(name, record.file.name);
  setText(size, formatFileSize(record.file.size));
  setText(extension, fileExtension(record.file.name, extension?.getAttribute("fallback") ?? "file", Number(extension?.getAttribute("max-length") ?? 4)));
  setText(status, statusText(record));
  for (const part of [name, size, extension, status, progress, remove]) {
    if (part) setAttribute(part, "data-state", state);
  }
  if (status) setAttribute(status, "data-value", String(record.progress));
  if (progress) {
    setAttribute(progress, "data-value", String(value));
    const indicator = progress.querySelector<HTMLElement>("[data-upload-progress-indicator]");
    if (indicator) {
      setAttribute(indicator, "data-state", state);
      setAttribute(indicator, "data-value", String(value));
      if (indicator.style.width !== `${value}%`) indicator.style.width = `${value}%`;
    }
  }
}

function ensureSelector(selector: HTMLElement) {
  const disabled = selector.hasAttribute("disabled") || selector.hasAttribute("is-disabled");
  setAttribute(selector, "tabindex", disabled ? "-1" : "0");
  setAttribute(selector, "data-disabled", disabled ? "true" : null);
  let input = selector.querySelector<HTMLInputElement>('input[type="file"][data-upload-input]');
  if (!input) {
    input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.setAttribute("aria-label", "Upload files");
    input.setAttribute("data-upload-input", "");
    selector.append(input);
  }
  if (input.hidden) input.hidden = false;
  if (input.tabIndex !== -1) input.tabIndex = -1;
  if (!input.hasAttribute("data-upload-visually-hidden")) {
    input.style.cssText = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0";
    input.setAttribute("data-upload-visually-hidden", "");
  }
  if (input.disabled !== disabled) input.disabled = disabled;
}

function ensureLiveRegion(root: HTMLElement) {
  let region = root.querySelector<HTMLElement>(":scope > [data-upload-live-region]");
  if (!region) {
    region = document.createElement("span");
    region.setAttribute("data-upload-live-region", "");
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", "polite");
    region.setAttribute("aria-atomic", "true");
    region.style.cssText = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0";
    root.append(region);
  }
  const state = uploadState(root).rootState;
  setText(region, { EMPTY: "", PROCESSED: "Files selected and ready to upload.", UPLOADING: "Uploading files, please wait.", UPLOADED: "All files uploaded successfully." }[state]);
}

export function syncUpload(root: HTMLElement) {
  const state = uploadState(root);
  if (state.syncing) return;
  state.syncing = true;
  try {
    for (const selector of root.querySelectorAll<HTMLElement>("aria-upload-selector")) {
      if (selector.closest("aria-upload") === root) ensureSelector(selector);
    }
    ensureLiveRegion(root);
    const list = uploadList(root);
    if (list) {
      const generated = new Map(Array.from(list.querySelectorAll<HTMLElement>(":scope > aria-upload-item[data-upload-generated]")).map((item) => [item.dataset.fileId, item]));
      for (const record of state.files) {
        let item = generated.get(record.id);
        if (!item) {
          item = renderItem(record);
          const firstAction = Array.from(list.children).find((child) => child.matches("aria-upload-clear, aria-upload-submit"));
          list.insertBefore(item, firstAction ?? null);
        }
        generated.delete(record.id);
        syncItem(item, record);
      }
      for (const stale of generated.values()) stale.remove();
      const actionsHidden = state.files.length === 0;
      for (const action of list.querySelectorAll<HTMLElement>(":scope > aria-upload-clear, :scope > aria-upload-submit")) {
        if (action.hidden !== actionsHidden) action.hidden = actionsHidden;
      }
    }
  } finally {
    state.syncing = false;
  }
}

export function syncUploadAround(element: HTMLElement) {
  const root = uploadRoot(element);
  if (root) syncUpload(root);
}

export function observeUpload(root: HTMLElement) {
  const state = uploadState(root);
  if (state.observer || typeof MutationObserver === "undefined") return;
  state.observer = new MutationObserver(() => syncUpload(root));
  state.observer.observe(root, { attributes: true, childList: true, subtree: true });
}

export function disconnectUpload(root: HTMLElement) {
  const state = uploadState(root);
  state.observer?.disconnect();
  state.observer = null;
}
