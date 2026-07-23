import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { defineUploadElements } from "../src";
import { syncUpload } from "../src/upload-sync";

type UploadRoot = HTMLElement & { files: Array<{ file: File; id: string; thumbNailUrl: string }> };

function mount(attributes = "", listAttributes = "") {
  const host = document.createElement("div");
  host.innerHTML = `<aria-upload ${attributes}>
    <aria-upload-selector>Choose files</aria-upload-selector>
    <aria-upload-list ${listAttributes}>
      <aria-upload-clear>Clear</aria-upload-clear>
      <aria-upload-submit>Upload files</aria-upload-submit>
    </aria-upload-list>
  </aria-upload>`;
  document.body.append(host);
  return host.querySelector("aria-upload") as UploadRoot;
}

function select(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, "files", { value: files, configurable: true });
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

class XhrMock extends EventTarget {
  static instances: XhrMock[] = [];
  readyState = 1;
  status = 0;
  upload = new EventTarget();
  abort = vi.fn(() => this.upload.dispatchEvent(new Event("abort")));
  open = vi.fn();
  send = vi.fn();
  constructor() { super(); XhrMock.instances.push(this); }
}

describe("@ariaui-web/upload upstream behavior parity", () => {
  beforeAll(() => defineUploadElements());
  beforeEach(() => {
    XhrMock.instances = [];
    vi.stubGlobal("XMLHttpRequest", XhrMock);
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: vi.fn((file: File) => `blob:${file.name}`),
      revokeObjectURL: vi.fn(),
    });
  });
  afterEach(() => {
    document.body.replaceChildren();
    vi.unstubAllGlobals();
  });

  it("creates the selector input and aggregate live region", () => {
    const root = mount();
    const selector = root.querySelector("aria-upload-selector")!;
    const input = selector.querySelector<HTMLInputElement>('input[type="file"]')!;
    expect(selector.getAttribute("role")).toBe("button");
    expect(selector.getAttribute("tabindex")).toBe("0");
    expect(input.getAttribute("aria-label")).toBe("Upload files");
    expect(input.multiple).toBe(true);
    expect(input.hidden).toBe(false);
    expect(input.tabIndex).toBe(-1);
    expect(input.style.position).toBe("absolute");
    expect(input.style.width).toBe("1px");
    expect(root.querySelector('[role="status"]')).not.toBeNull();
  });

  it("keeps selector and hidden input IDs unique", () => {
    const root = mount();
    const selector = root.querySelector<HTMLElement>("aria-upload-selector")!;
    const input = selector.querySelector<HTMLInputElement>("input")!;
    selector.id = "file-input";
    syncUpload(root);
    expect(selector.id).toBe("file-input");
    expect(input.id).not.toBe("file-input");
  });

  it("settles without emitting mutations when synchronized state is unchanged", async () => {
    const root = mount();
    await Promise.resolve();
    const observer = new MutationObserver(() => undefined);
    observer.observe(root, { attributes: true, childList: true, subtree: true });
    syncUpload(root);
    await Promise.resolve();
    expect(observer.takeRecords()).toHaveLength(0);
    observer.disconnect();
  });

  it("filters formats and accumulates valid files across selections", () => {
    const root = mount('format="pdf,png"');
    const input = root.querySelector<HTMLInputElement>('input[type="file"]')!;
    select(input, [new File(["pdf"], "brief.pdf", { type: "application/pdf" }), new File(["txt"], "notes.txt", { type: "text/plain" })]);
    select(input, [new File(["png"], "cover.png", { type: "image/png" })]);
    expect(root.files.map(({ file }) => file.name)).toEqual(["brief.pdf", "cover.png"]);
    expect(root.querySelectorAll("aria-upload-item")).toHaveLength(2);
  });

  it("accepts dropped files and exposes formatted public file parts", () => {
    const root = mount();
    const selector = root.querySelector("aria-upload-selector")!;
    const drop = new Event("drop", { bubbles: true, cancelable: true }) as DragEvent;
    Object.defineProperty(drop, "dataTransfer", { value: { files: [new File([new Uint8Array(2048)], "archive.longext", { type: "application/octet-stream" })] } });
    selector.dispatchEvent(drop);
    const item = root.querySelector("aria-upload-item")!;
    expect(item.querySelector("aria-upload-file-name")?.textContent).toBe("archive.longext");
    expect(item.querySelector("aria-upload-file-size")?.textContent).toBe("2.0 KB");
    expect(item.querySelector("aria-upload-file-extension")?.textContent).toBe("long");
    expect(item.querySelector("aria-upload-file-status")?.textContent).toBe("Ready");
    expect(item.querySelector("aria-upload-file-progress")?.getAttribute("data-value")).toBe("0");
  });

  it("removes one file, clears all files, and revokes object URLs", () => {
    const root = mount();
    const input = root.querySelector<HTMLInputElement>('input[type="file"]')!;
    select(input, [new File(["a"], "a.pdf"), new File(["b"], "b.pdf")]);
    root.querySelector<HTMLElement>("aria-upload-file-remove")!.click();
    expect(root.files.map(({ file }) => file.name)).toEqual(["b.pdf"]);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:a.pdf");
    root.querySelector<HTMLElement>("aria-upload-clear")!.click();
    expect(root.files).toEqual([]);
    expect(root.querySelectorAll("aria-upload-item")).toHaveLength(0);
  });

  it("honors canceled clear, remove, and submit actions", () => {
    const root = mount();
    const input = root.querySelector<HTMLInputElement>('input[type="file"]')!;
    select(input, [new File(["a"], "a.pdf")]);
    for (const selector of ["aria-upload-file-remove", "aria-upload-clear", "aria-upload-submit"]) {
      const action = root.querySelector<HTMLElement>(selector)!;
      action.addEventListener("click", (event) => event.preventDefault());
      action.click();
    }
    expect(root.files).toHaveLength(1);
    expect(XhrMock.instances).toHaveLength(0);
  });

  it("suppresses disabled selector activation and supports Enter and Space", () => {
    const disabledRoot = mount("", "");
    const disabled = disabledRoot.querySelector<HTMLElement>("aria-upload-selector")!;
    disabled.setAttribute("disabled", "");
    const disabledInput = disabled.querySelector<HTMLInputElement>("input")!;
    const disabledClick = vi.spyOn(disabledInput, "click");
    disabled.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true }));
    expect(disabled.getAttribute("tabindex")).toBe("-1");
    expect(disabledInput.disabled).toBe(true);
    expect(disabledClick).not.toHaveBeenCalled();

    const root = mount();
    const selector = root.querySelector<HTMLElement>("aria-upload-selector")!;
    const input = selector.querySelector<HTMLInputElement>("input")!;
    const click = vi.spyOn(input, "click");
    selector.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true }));
    selector.dispatchEvent(new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true }));
    selector.dispatchEvent(new KeyboardEvent("keyup", { key: " ", code: "Space", bubbles: true }));
    expect(click).toHaveBeenCalledTimes(2);
  });

  it("opens the file input before selector clicks reach an outer event boundary", () => {
    const root = mount();
    const selector = root.querySelector<HTMLElement>("aria-upload-selector")!;
    const input = selector.querySelector<HTMLInputElement>("input")!;
    const click = vi.spyOn(input, "click");
    selector.addEventListener("click", (event) => event.stopPropagation());

    selector.click();

    expect(click).toHaveBeenCalledOnce();
  });

  it("treats is-disabled as disabled for click, keyboard, and drop interaction", () => {
    const root = mount();
    const selector = root.querySelector<HTMLElement>("aria-upload-selector")!;
    selector.setAttribute("is-disabled", "");
    const input = selector.querySelector<HTMLInputElement>("input")!;
    const click = vi.spyOn(input, "click");
    selector.click();
    selector.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true }));
    const drop = new Event("drop", { bubbles: true, cancelable: true }) as DragEvent;
    Object.defineProperty(drop, "dataTransfer", { value: { files: [new File(["a"], "a.pdf")] } });
    selector.dispatchEvent(drop);
    expect(selector.getAttribute("tabindex")).toBe("-1");
    expect(input.disabled).toBe(true);
    expect(click).not.toHaveBeenCalled();
    expect(root.files).toHaveLength(0);
  });

  it("submits files, reflects progress, and reports success once", () => {
    const root = mount("", 'url="/api/upload" method="POST"');
    const list = root.querySelector<HTMLElement>("aria-upload-list")! as HTMLElement & { onSuccess: ReturnType<typeof vi.fn> };
    list.onSuccess = vi.fn();
    select(root.querySelector<HTMLInputElement>("input")!, [new File(["a"], "a.pdf")]);
    root.querySelector<HTMLElement>("aria-upload-submit")!.click();
    const xhr = XhrMock.instances[0]!;
    xhr.upload.dispatchEvent(Object.assign(new Event("progress"), { lengthComputable: true, loaded: 1, total: 2 }));
    expect(root.querySelector("aria-upload-item")?.getAttribute("data-progress")).toBe("50");
    expect(root.querySelector("aria-upload-file-status")?.textContent).toBe("50%");
    xhr.status = 201;
    xhr.dispatchEvent(new Event("loadend"));
    xhr.dispatchEvent(new Event("loadend"));
    expect(list.onSuccess).toHaveBeenCalledTimes(1);
    expect(list.onSuccess.mock.calls[0]?.[0]).not.toHaveProperty("reason");
    expect(root.querySelector("aria-upload-item")?.getAttribute("data-state")).toBe("uploaded");
    expect(root.querySelector('[role="status"]')?.textContent).toBe("All files uploaded successfully.");
  });

  it("reports an upload error only once when error and loadend both fire", () => {
    const root = mount("", 'url="/api/upload" method="POST"');
    const list = root.querySelector<HTMLElement>("aria-upload-list")! as HTMLElement & { onError: ReturnType<typeof vi.fn> };
    list.onError = vi.fn();
    select(root.querySelector<HTMLInputElement>("input")!, [new File(["a"], "a.pdf")]);
    root.querySelector<HTMLElement>("aria-upload-submit")!.click();
    const xhr = XhrMock.instances[0]!;
    xhr.dispatchEvent(new Event("error"));
    xhr.dispatchEvent(new Event("loadend"));
    expect(list.onError).toHaveBeenCalledTimes(1);
    expect(root.querySelector("aria-upload-file-status")?.textContent).toBe("Failed");
  });

  it("distinguishes an unsuccessful HTTP status from a transport error", () => {
    const root = mount("", 'url="/api/upload" method="POST"');
    const list = root.querySelector<HTMLElement>("aria-upload-list")! as HTMLElement & { onError: ReturnType<typeof vi.fn> };
    list.onError = vi.fn();
    select(root.querySelector<HTMLInputElement>("input")!, [new File(["a"], "a.pdf")]);
    root.querySelector<HTMLElement>("aria-upload-submit")!.click();
    const xhr = XhrMock.instances[0]!;
    xhr.status = 500;
    xhr.dispatchEvent(new Event("loadend"));
    expect(list.onError).toHaveBeenCalledWith(expect.objectContaining({ reason: "status", status: 500 }));
  });

  it("does not report intentional aborts when clearing or disconnecting", () => {
    const root = mount("", 'url="/api/upload" method="POST"');
    const list = root.querySelector<HTMLElement>("aria-upload-list")! as HTMLElement & { onError: ReturnType<typeof vi.fn> };
    list.onError = vi.fn();
    select(root.querySelector<HTMLInputElement>("input")!, [new File(["a"], "a.pdf")]);
    root.querySelector<HTMLElement>("aria-upload-submit")!.click();
    root.querySelector<HTMLElement>("aria-upload-clear")!.click();
    expect(list.onError).not.toHaveBeenCalled();
    expect(root.files).toHaveLength(0);

    select(root.querySelector<HTMLInputElement>("input")!, [new File(["b"], "b.pdf")]);
    root.querySelector<HTMLElement>("aria-upload-submit")!.click();
    root.remove();
    expect(list.onError).not.toHaveBeenCalled();
  });

  it("auto-submits processed files unless disabled", async () => {
    const root = mount("", 'url="/api/upload" method="POST"');
    root.append(document.createElement("aria-upload-auto-submit"));
    select(root.querySelector<HTMLInputElement>("input")!, [new File(["a"], "a.pdf")]);
    await vi.waitFor(() => expect(XhrMock.instances).toHaveLength(1));

    document.body.replaceChildren();
    XhrMock.instances = [];
    const disabledRoot = mount("", 'url="/api/upload" method="POST"');
    const auto = document.createElement("aria-upload-auto-submit");
    auto.setAttribute("disabled", "");
    disabledRoot.append(auto);
    select(disabledRoot.querySelector<HTMLInputElement>("input")!, [new File(["b"], "b.pdf")]);
    await Promise.resolve();
    expect(XhrMock.instances).toHaveLength(0);
  });
});
