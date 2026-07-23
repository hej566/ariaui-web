import { createToast } from "@ariaui-web/toast";

const installedDocuments = new WeakSet<Document>();
const boundRoots = new WeakSet<HTMLElement>();

type UploadErrorPayload = {
  file: {
    file: File;
  };
};

type UploadListElement = HTMLElement & {
  onError: ((payload: UploadErrorPayload) => void) | null;
};

type UploadRequestDetail = {
  progress(value: number): void;
  resolve(status?: number): void;
};

function nextUploadToastId() {
  return `upload-error-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createUploadErrorToast(fileName: string) {
  const item = document.createElement("aria-toast-item");
  item.className = "ariaui-web-toast-item ariaui-web-upload-toast-item origin-bottom";
  item.setAttribute("duration", "5000");
  item.innerHTML = `
    <svg class="ariaui-web-upload-toast-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 3 2.5 20h19L12 3Zm0 5.5v5M12 17.5v.01"></path>
    </svg>
    <div class="ariaui-web-toast-copy">
      <h3>Upload failed</h3>
      <p><span data-upload-error-file></span> could not be uploaded. Please try again.</p>
    </div>
    <div class="ariaui-web-upload-toast-actions">
      <aria-toast-close class="ariaui-web-upload-toast-action">Try again</aria-toast-close>
    </div>
    <aria-toast-close class="ariaui-web-toast-close" aria-label="Dismiss upload error">
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"></path></svg>
    </aria-toast-close>`;
  const file = item.querySelector<HTMLElement>("[data-upload-error-file]");
  if (file) file.textContent = fileName;
  createToast({
    id: nextUploadToastId(),
    duration: 5000,
    template: item,
  });
}

function bind(root: HTMLElement) {
  if (boundRoots.has(root)) return;
  boundRoots.add(root);
  const variant = root.closest<HTMLElement>("[data-example-variant]")?.dataset.exampleVariant;
  const list = root.querySelector<UploadListElement>("aria-upload-list");
  if (variant === "upload" && list) {
    list.onError = ({ file }) => createUploadErrorToast(file.file.name);
  }
  if (root.hasAttribute("data-upload-demo-success")) {
    root.addEventListener("uploadrequest", (event) => {
      event.preventDefault();
      const detail = (event as CustomEvent<UploadRequestDetail>).detail;
      window.setTimeout(() => detail.progress(42), 120);
      window.setTimeout(() => detail.progress(78), 260);
      window.setTimeout(() => detail.resolve(201), 420);
    });
  }
}

export function syncUploadExamples(doc: Document = document) {
  for (const root of doc.querySelectorAll<HTMLElement>('[data-component="upload"] aria-upload')) bind(root);
}

export function installUploadExamples(doc: Document = document) {
  syncUploadExamples(doc);
  if (installedDocuments.has(doc)) return;
  installedDocuments.add(doc);
  new MutationObserver(() => syncUploadExamples(doc)).observe(doc.documentElement, { childList: true, subtree: true });
}
