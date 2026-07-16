import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineDatepickerElements } from "@ariaui-web/datepicker";
import { afterEach, describe, expect, it, vi } from "vitest";
import { installDatepickerExamples } from "../docs/.vitepress/theme/datepicker-examples";

type RuntimeDatepickerElement = HTMLElement & {
  open: boolean;
  value: string;
};

function datepickerPreviews() {
  const doc = readFileSync(join(process.cwd(), "web/doc/docs/components/datepicker.md"), "utf8");
  const previews: Array<{ className: string; variant: string; markup: string }> = [];
  for (const match of doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="datepicker" data-example-variant="([^"]+)">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const end = doc.indexOf("\n</div>", start);
    previews.push({ className: match[1] ?? "", variant: match[2] ?? "", markup: doc.slice(start, end).trim() });
  }
  return previews;
}

async function flush() {
  await Promise.resolve();
  await Promise.resolve();
}

function inputControl(root: HTMLElement) {
  const input = root.querySelector("aria-datepicker-input input");
  expect(input).toBeInstanceOf(HTMLInputElement);
  return input as HTMLInputElement;
}

function enabledCell(root: HTMLElement, date: string) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-calendar-cell"))
    .find((cell) => cell.getAttribute("date") === date && cell.getAttribute("aria-disabled") !== "true");
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe("Datepicker live examples", () => {
  it("keeps the source page examples interactive", async () => {
    defineDatepickerElements();
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      queueMicrotask(() => callback(0));
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());

    document.body.innerHTML = datepickerPreviews()
      .map((preview) => `<div class="${preview.className}" data-component="datepicker" data-example-variant="${preview.variant}">\n${preview.markup}\n</div>`)
      .join("\n");
    installDatepickerExamples(document);
    await flush();

    const roots = Array.from(document.querySelectorAll("aria-datepicker")) as RuntimeDatepickerElement[];
    expect(roots).toHaveLength(4);

    const singleRoot = roots[0]!;
    const singleInput = inputControl(singleRoot);
    expect(singleInput.value).toBe("01/20/2025");
    singleRoot.querySelector<HTMLElement>("aria-datepicker-trigger")!.click();
    await flush();
    expect(singleRoot.open).toBe(true);
    expect(singleRoot.querySelector<HTMLElement>("aria-datepicker-content")!.style.position).toBe("fixed");
    enabledCell(singleRoot, "2025-01-25")?.click();
    await flush();
    expect(singleRoot.open).toBe(false);
    expect(singleRoot.value).toBe("2025-01-25");
    expect(singleInput.value).toBe("01/25/2025");

    const rangeRoot = roots[1]!;
    const rangeInput = inputControl(rangeRoot);
    rangeRoot.removeAttribute("value");
    await flush();
    rangeInput.value = "0120202501252025";
    rangeInput.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      data: "0120202501252025",
      inputType: "insertFromPaste",
    }));
    rangeInput.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    await flush();
    expect(rangeInput.value).toBe("01/20/2025 - 01/25/2025");
    expect(rangeRoot.value).toBe("2025-01-20,2025-01-25");

    const dualRoot = roots[2]!;
    dualRoot.querySelector<HTMLElement>("aria-datepicker-trigger")!.click();
    await flush();
    expect(dualRoot.open).toBe(true);
    expect(dualRoot.querySelectorAll("[data-slot='calendar-pane']")).toHaveLength(2);

    const motionRoot = roots[3]!;
    motionRoot.querySelector<HTMLElement>("aria-datepicker-trigger")!.click();
    await flush();
    const motionContent = motionRoot.querySelector<HTMLElement>("[data-motion-content]")!;
    expect(motionContent.hidden).toBe(false);
    expect(motionContent.getAttribute("role")).toBe("dialog");
  });
});
