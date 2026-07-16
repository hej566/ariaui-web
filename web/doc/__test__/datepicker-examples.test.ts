import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineDatepickerElements } from "@ariaui-web/datepicker";
import { afterEach, describe, expect, it, vi } from "vitest";
import { installDatepickerExamples } from "../docs/.vitepress/theme/datepicker-examples";

const { animateMock } = vi.hoisted(() => ({ animateMock: vi.fn() }));
vi.mock("framer-motion/dom", () => ({ animate: animateMock }));

type RuntimeDatepickerElement = HTMLElement & {
  open: boolean;
  value: string;
};

const root = process.cwd();
const read = (...segments: string[]) =>
  readFileSync(join(root, ...segments), "utf8");

function datepickerPreviews() {
  const doc = read("web", "doc", "docs", "components", "datepicker.md");
  const previews: Array<{ className: string; variant: string; markup: string }> = [];
  for (const match of doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="datepicker" data-example-variant="([^"]+)">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const end = doc.indexOf("\n</div>", start);
    previews.push({ className: match[1] ?? "", variant: match[2] ?? "", markup: doc.slice(start, end).trim() });
  }
  return previews;
}

function datepickerStylesheet() {
  return read("web", "doc", "docs", ".vitepress", "theme", "style.css");
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
  animateMock.mockReset();
  document.body.replaceChildren();
});

describe("Datepicker live examples", () => {
  it("keeps Framer Motion in docs and out of the package", () => {
    const docsPackage = JSON.parse(read("web", "doc", "package.json"));
    const datepickerPackage = JSON.parse(read("packages", "datepicker", "package.json"));
    const installer = read("web", "doc", "docs", ".vitepress", "theme", "datepicker-examples.ts");
    const datepickerSource = [
      "datepicker-element.ts",
      "datepicker-input.ts",
      "index.ts",
    ]
      .map((file) => read("packages", "datepicker", "src", file))
      .join("\n");
    const previews = datepickerPreviews();

    expect(docsPackage.dependencies?.["framer-motion"]).toBe("^12.38.0");
    expect(datepickerPackage.dependencies?.["framer-motion"]).toBeUndefined();
    expect(datepickerPackage.devDependencies?.["framer-motion"]).toBeUndefined();
    expect(datepickerSource).not.toMatch(/framer-motion|react-dom|from ["']react["']/);
    expect(installer).toContain('from "framer-motion/dom"');
    expect(installer).toContain("animate(");
    expect(previews.find((preview) => preview.variant === "framer-motion")?.markup).toContain(
      "data-framer-motion-content",
    );
  });

  it("forces the generated dual-range calendar body into a side-by-side pane row", () => {
    const css = datepickerStylesheet();
    const dualBodyRule = css.match(
      /\.ariaui-web-preview\[data-component="datepicker"\] \[data-slot="calendar-body"\]\[data-calendar-dual-container="true"\]\s*\{[^}]+\}/,
    )?.[0] ?? "";

    expect(dualBodyRule).toContain("display: flex;");
    expect(dualBodyRule).toContain("flex-direction: row;");
    expect(css).toContain(
      '.ariaui-web-preview[data-component="datepicker"] aria-datepicker[data-datepicker-motion-closing="true"]',
    );
    expect(css).toContain(
      '.ariaui-web-preview[data-component="datepicker"] [data-framer-motion-content][data-side="top"]',
    );
  });

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

    const rootByVariant = (variant: string) => {
      const preview = document.querySelector<HTMLElement>(`[data-component="datepicker"][data-example-variant="${variant}"]`);
      expect(preview).toBeInstanceOf(HTMLElement);
      const root = preview?.querySelector("aria-datepicker") as RuntimeDatepickerElement | null;
      expect(root).toBeInstanceOf(HTMLElement);
      return root!;
    };

    const rootByMask = (
      variant: string,
      mask: string,
      placeholder: string,
    ) => {
      const root = rootByVariant(variant);
      expect(root.getAttribute("input-mask")).toBe(mask);
      expect(inputControl(root).placeholder).toBe(placeholder);
      return root;
    };

    const singleRoot = rootByMask("single", "mdy", "Select date");
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
    singleInput.setSelectionRange(0, singleInput.value.length);
    singleInput.dispatchEvent(new InputEvent("beforeinput", {
      bubbles: true,
      cancelable: true,
      inputType: "deleteContentBackward",
    }));
    singleInput.value = "";
    singleInput.setSelectionRange(0, 0);
    singleInput.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      inputType: "deleteContentBackward",
    }));
    expect(singleInput.value).toBe("");
    singleInput.setSelectionRange(0, 0);
    singleInput.dispatchEvent(new InputEvent("beforeinput", {
      bubbles: true,
      cancelable: true,
      data: "/",
      inputType: "insertText",
    }));
    singleInput.value = "/";
    singleInput.setSelectionRange(1, 1);
    singleInput.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      data: "/",
      inputType: "insertText",
    }));
    expect(singleInput.value).toBe("/");
    singleInput.setSelectionRange(1, 1);
    singleInput.dispatchEvent(new InputEvent("beforeinput", {
      bubbles: true,
      cancelable: true,
      data: "12",
      inputType: "insertText",
    }));
    singleInput.value = "/12";
    singleInput.setSelectionRange(3, 3);
    singleInput.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      data: "12",
      inputType: "insertText",
    }));
    expect(singleInput.value).toBe("12");
    singleInput.setSelectionRange(2, 2);
    singleInput.dispatchEvent(new InputEvent("beforeinput", {
      bubbles: true,
      cancelable: true,
      data: "/",
      inputType: "insertText",
    }));
    singleInput.value = "12/";
    singleInput.setSelectionRange(3, 3);
    singleInput.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      data: "/",
      inputType: "insertText",
    }));
    expect(singleInput.value).toBe("12/");

    const rangeRoot = rootByMask("range", "iso", "Select date");
    const rangeInput = inputControl(rangeRoot);
    expect(rangeInput.value).toBe("2025-01-12 - 2025-01-18");
    rangeRoot.removeAttribute("value");
    await flush();
    rangeInput.value = "2025012020250125";
    rangeInput.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      data: "2025012020250125",
      inputType: "insertFromPaste",
    }));
    rangeInput.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    await flush();
    expect(rangeInput.value).toBe("2025-01-20 - 2025-01-25");
    expect(rangeRoot.value).toBe("2025-01-20,2025-01-25");
    rangeInput.setSelectionRange(rangeInput.value.length, rangeInput.value.length);
    rangeInput.dispatchEvent(new InputEvent("beforeinput", {
      bubbles: true,
      cancelable: true,
      inputType: "deleteContentBackward",
    }));
    rangeInput.value = rangeInput.value.slice(0, -1);
    rangeInput.setSelectionRange(rangeInput.value.length, rangeInput.value.length);
    rangeInput.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      inputType: "deleteContentBackward",
    }));
    expect(rangeInput.value).toBe("2025-01-20 - 2025-01-2");

    const dualRoot = rootByMask("dual-range", "mdy", "MM/DD/YYYY - MM/DD/YYYY");
    expect(inputControl(dualRoot).value).toBe("01/12/2025 - 02/08/2025");
    dualRoot.querySelector<HTMLElement>("aria-datepicker-trigger")!.click();
    await flush();
    expect(dualRoot.open).toBe(true);
    expect(dualRoot.querySelectorAll("[data-slot='calendar-pane']")).toHaveLength(2);

    const animationResolves: Array<() => void> = [];
    animateMock.mockImplementation(() => {
      let finish!: () => void;
      const finished = new Promise<void>((resolve) => {
        finish = resolve;
      });
      animationResolves.push(finish);
      return {
        stop: vi.fn(),
        then: (resolve: () => void) => finished.then(resolve),
      };
    });
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
    const motionRoot = rootByMask("framer-motion", "mdy", "Select date");
    expect(inputControl(motionRoot).value).toBe("03/15/2025");
    motionRoot.querySelector<HTMLElement>("aria-datepicker-trigger")!.click();
    await flush();
    const motionContent = motionRoot.querySelector<HTMLElement>("[data-framer-motion-content]")!;
    expect(motionContent.hidden).toBe(false);
    expect(motionContent.getAttribute("role")).toBe("dialog");
    expect(animateMock).toHaveBeenLastCalledWith(
      motionContent,
      { opacity: [0, 1], y: [8, 0], scale: [0.96, 1] },
      { duration: 0.18, ease: "easeOut" },
    );

    motionRoot.querySelector<HTMLElement>("aria-datepicker-trigger")!.click();
    await flush();
    expect(animateMock).toHaveBeenLastCalledWith(
      motionContent,
      { opacity: [1, 0], y: [0, 12], scale: [1, 0.94] },
      { duration: 0.24, ease: "easeIn" },
    );
    expect(motionRoot.dataset.datepickerMotionClosing).toBe("true");
    expect(motionContent.style.pointerEvents).toBe("none");
    animationResolves.at(-1)?.();
    await flush();
    expect(motionContent.hidden).toBe(true);
    expect(motionRoot.dataset.datepickerMotionClosing).toBeUndefined();

    motionRoot.querySelector<HTMLElement>("aria-datepicker-trigger")!.click();
    await flush();
    motionContent.dataset.side = "top";
    motionRoot.querySelector<HTMLElement>("aria-datepicker-trigger")!.click();
    await flush();
    expect(animateMock).toHaveBeenLastCalledWith(
      motionContent,
      { opacity: [1, 0], y: [0, 0], scale: [1, 0.94] },
      { duration: 0.24, ease: "easeIn" },
    );
  });
});
