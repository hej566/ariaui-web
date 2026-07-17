import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineDisclosureElements } from "@ariaui-web/disclosure";
import { afterEach, describe, expect, it, vi } from "vitest";
import { installDisclosureExamples } from "../docs/.vitepress/theme/disclosure-examples";

const { animateMock } = vi.hoisted(() => ({ animateMock: vi.fn() }));
vi.mock("framer-motion/dom", () => ({ animate: animateMock }));

type RuntimeDisclosureElement = HTMLElement & {
  open: boolean;
};

const root = process.cwd();
const read = (...segments: string[]) =>
  readFileSync(join(root, ...segments), "utf8");

function disclosurePreviews() {
  const doc = read("web", "doc", "docs", "components", "disclosure.md");
  const previews: Array<{ className: string; variant: string; markup: string }> = [];
  for (const match of doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="disclosure" data-example-variant="([^"]+)">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const end = doc.indexOf("\n</div>", start);
    previews.push({ className: match[1] ?? "", variant: match[2] ?? "", markup: doc.slice(start, end).trim() });
  }
  return previews;
}

async function flush() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  vi.restoreAllMocks();
  animateMock.mockReset();
  document.body.replaceChildren();
});

describe("Disclosure live examples", () => {
  it("keeps Framer Motion in docs and out of the package", () => {
    const docsPackage = JSON.parse(read("web", "doc", "package.json"));
    const disclosurePackage = JSON.parse(read("packages", "disclosure", "package.json"));
    const installer = read("web", "doc", "docs", ".vitepress", "theme", "disclosure-examples.ts");
    const disclosureSource = [
      "disclosure-element.ts",
      "index.ts",
    ]
      .map((file) => read("packages", "disclosure", "src", file))
      .join("\n");
    const previews = disclosurePreviews();

    expect(docsPackage.dependencies?.["framer-motion"]).toBe("^12.38.0");
    expect(disclosurePackage.dependencies?.["framer-motion"]).toBeUndefined();
    expect(disclosurePackage.devDependencies?.["framer-motion"]).toBeUndefined();
    expect(disclosureSource).not.toMatch(/framer-motion|react-dom|from ["']react["']/);
    expect(installer).toContain('from "framer-motion/dom"');
    expect(installer).toContain("animate(");
    expect(previews.map((preview) => preview.variant)).toEqual([
      "collapsible",
      "framer-motion",
    ]);
    expect(previews.find((preview) => preview.variant === "framer-motion")?.markup).toContain(
      "data-disclosure-motion-content",
    );
  });

  it("keeps the source page examples interactive", async () => {
    defineDisclosureElements();
    animateMock.mockImplementation(() => ({
      stop: vi.fn(),
      then: (resolve: () => void) => {
        queueMicrotask(resolve);
        return Promise.resolve();
      },
    }));

    document.body.innerHTML = disclosurePreviews()
      .map((preview) => `<div class="${preview.className}" data-component="disclosure" data-example-variant="${preview.variant}">\n${preview.markup}\n</div>`)
      .join("\n");
    installDisclosureExamples(document);
    await flush();

    const rootByVariant = (variant: string) => {
      const preview = document.querySelector<HTMLElement>(`[data-component="disclosure"][data-example-variant="${variant}"]`);
      expect(preview).toBeInstanceOf(HTMLElement);
      const root = preview?.querySelector("aria-disclosure") as RuntimeDisclosureElement | null;
      expect(root).toBeInstanceOf(HTMLElement);
      return root!;
    };

    const collapsible = rootByVariant("collapsible");
    const collapsibleTrigger = collapsible.querySelector<HTMLElement>("aria-disclosure-trigger")!;
    const collapsibleContent = collapsible.querySelector<HTMLElement>("aria-disclosure-content")!;

    expect(collapsible.open).toBe(false);
    expect(collapsibleTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(collapsibleContent.hidden).toBe(true);

    collapsibleTrigger.click();
    await flush();

    expect(collapsible.open).toBe(true);
    expect(collapsibleTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(collapsibleContent.hidden).toBe(false);

    const motion = rootByVariant("framer-motion");
    const motionTrigger = motion.querySelector<HTMLElement>("aria-disclosure-trigger")!;
    const motionContent = motion.querySelector<HTMLElement>("[data-disclosure-motion-content]")!;

    motionTrigger.click();
    await flush();

    expect(motion.open).toBe(true);
    expect(animateMock).toHaveBeenCalled();
    expect(motionContent.style.height).toBe("auto");

    motionTrigger.click();
    await flush();

    expect(motion.open).toBe(false);
    expect(motionContent.style.height).toBe("0px");
    expect(motionContent.style.opacity).toBe("0");
  });
});
