import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { definePortalElements } from "@ariaui-web/portal";
import { clearToasts, defineToastElements } from "@ariaui-web/toast";
import { defineUploadElements } from "@ariaui-web/upload";
import { installUploadExamples } from "../docs/.vitepress/theme/upload-examples";

const docsRoot = join(process.cwd(), "web", "doc", "docs");
const page = readFileSync(join(docsRoot, "components", "upload.md"), "utf8");
const style = readFileSync(join(docsRoot, ".vitepress", "theme", "style.css"), "utf8");
const theme = readFileSync(join(docsRoot, ".vitepress", "theme", "index.ts"), "utf8");
const examples = readFileSync(join(docsRoot, ".vitepress", "theme", "upload-examples.ts"), "utf8");

describe("Upload documentation examples", () => {
  afterEach(() => {
    document.body.replaceChildren();
    clearToasts();
  });

  it("matches the upstream page structure and three examples", () => {
    for (const heading of ["Features", "Installation", "Examples", "Anatomy", "API Reference", "Keyboard Interactions", "Accessibility"]) {
      expect(page).toContain(`## ${heading}`);
    }
    for (const variant of ["upload", "manual-upload", "successful-upload"]) {
      expect(page).toContain(`data-example-variant="${variant}"`);
    }
    expect(page.match(/data-component="upload"/g)).toHaveLength(3);
  });

  it("preserves upstream Tailwind tokens and native upload parts", () => {
    expect(page).toContain("flex w-full max-w-[300px] flex-col gap-3");
    expect(page).toContain("group flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center shadow-xs");
    for (const part of ["auto-submit", "clear", "submit", "file-name", "file-size", "file-extension", "file-status", "file-progress", "file-remove"]) {
      expect(page).toContain(`aria-upload-${part}`);
    }
    expect(style).toContain('.ariaui-web-preview[data-component="upload"]');
    expect(style).toMatch(/\.ariaui-web-preview\[data-component="upload"\]\s*\{[^}]*align-items:\s*center;/s);
  });

  it("installs docs-only transports, error feedback, and source snippets", () => {
    expect(examples).toContain("uploadrequest");
    expect(examples).toContain("data-upload-demo-success");
    expect(examples).toContain("createUploadErrorToast");
    expect(page).toContain("<aria-portal>");
    expect(page).toContain("data-upload-toast-list");
    expect(theme).toContain("installUploadExamples");
    expect(page.match(/```html/g)).toHaveLength(4);
  });

  it("matches the upstream default example error toast and dismissal behavior", () => {
    definePortalElements();
    defineToastElements();
    defineUploadElements();
    document.body.innerHTML = `
      <div data-component="upload" data-example-variant="upload">
        <aria-upload>
          <aria-upload-list></aria-upload-list>
        </aria-upload>
      </div>
      <aria-toast-list stack visible-toasts="3" data-upload-toast-list></aria-toast-list>
    `;
    installUploadExamples(document);
    const list = document.querySelector("aria-upload-list") as HTMLElement & {
      onError: ((payload: { file: { file: File } }) => void) | null;
    };
    list.onError?.({ file: { file: new File(["report"], "report.pdf") } });

    const toast = document.querySelector("aria-toast-item");
    expect(toast?.textContent).toContain("Upload failed");
    expect(toast?.textContent).toContain("report.pdf could not be uploaded. Please try again.");
    expect(toast?.textContent).toContain("Try again");
    expect(toast?.querySelector('[aria-label="Dismiss upload error"]')).not.toBeNull();

    toast?.querySelector<HTMLElement>("aria-toast-close")?.click();
    expect(document.querySelector("aria-toast-item")).toBeNull();
  });
});
