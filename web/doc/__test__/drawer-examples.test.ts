import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineDrawerElements } from "@ariaui-web/drawer";
import { afterEach, describe, expect, it, vi } from "vitest";
import { installDrawerExamples } from "../docs/.vitepress/theme/drawer-examples";

const { animateMock } = vi.hoisted(() => ({ animateMock: vi.fn() }));
vi.mock("framer-motion/dom", () => ({ animate: animateMock }));

type RuntimeDrawerElement = HTMLElement & { open: boolean };

const root = process.cwd();
const read = (...segments: string[]) => readFileSync(join(root, ...segments), "utf8");

function drawerPreviews() {
  const doc = read("web", "doc", "docs", "components", "drawer.md");
  const previews: Array<{ className: string; variant: string; markup: string }> = [];
  for (const match of doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="drawer" data-example-variant="([^"]+)">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const end = doc.indexOf("\n</div>\n\n```html", start);
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
  vi.unstubAllGlobals();
  animateMock.mockReset();
  document.body.replaceChildren();
  document.body.style.overflow = "";
});

describe("Drawer live examples", () => {
  it("keeps Framer Motion in docs and out of the package", () => {
    const docsPackage = JSON.parse(read("web", "doc", "package.json"));
    const drawerPackage = JSON.parse(read("packages", "drawer", "package.json"));
    const installer = read("web", "doc", "docs", ".vitepress", "theme", "drawer-examples.ts");
    const drawerSource = ["drawer-element.ts", "index.ts"].map((file) => read("packages", "drawer", "src", file)).join("\n");
    const previews = drawerPreviews();
    expect(docsPackage.dependencies?.["framer-motion"]).toBe("^12.38.0");
    expect(drawerPackage.dependencies?.["framer-motion"]).toBeUndefined();
    expect(drawerPackage.devDependencies?.["framer-motion"]).toBeUndefined();
    expect(drawerSource).not.toMatch(/framer-motion|react-dom|from ["']react["']/);
    expect(installer).toContain('from "framer-motion/dom"');
    expect(installer).toContain("animate(");
    expect(previews.map((preview) => preview.variant)).toEqual(["default", "sides", "framer-motion"]);
  });

  it("keeps the source page examples interactive", async () => {
    defineDrawerElements();
    Object.defineProperty(window, "matchMedia", { configurable: true, value: vi.fn(() => ({ matches: false })) });
    animateMock.mockImplementation(() => ({
      stop: vi.fn(),
      then: (resolve: () => void) => {
        queueMicrotask(resolve);
        return Promise.resolve();
      },
    }));
    document.body.innerHTML = drawerPreviews()
      .map((preview) => `<div class="${preview.className}" data-component="drawer" data-example-variant="${preview.variant}">\n${preview.markup}\n</div>`)
      .join("\n");
    installDrawerExamples(document);
    await flush();

    const rootByVariant = (variant: string, index = 0) => {
      const preview = document.querySelector<HTMLElement>(`[data-component="drawer"][data-example-variant="${variant}"]`);
      expect(preview).toBeInstanceOf(HTMLElement);
      const roots = Array.from(preview!.querySelectorAll("aria-drawer")) as RuntimeDrawerElement[];
      expect(roots.length).toBeGreaterThan(index);
      return roots[index]!;
    };
    const portalledContent = (drawerRoot: HTMLElement) => {
      const content = document.querySelector<HTMLElement>(`aria-drawer-content[data-drawer-portal-root="${drawerRoot.id}"]`);
      expect(content).toBeInstanceOf(HTMLElement);
      return content!;
    };
    const portalledOverlayPart = (drawerRoot: HTMLElement, selector: string) => {
      const part = document.querySelector<HTMLElement>(`aria-drawer-overlay[data-drawer-portal-root="${drawerRoot.id}"] ${selector}`);
      expect(part).toBeInstanceOf(HTMLElement);
      return part!;
    };

    for (const drawerRoot of Array.from(document.querySelectorAll<RuntimeDrawerElement>("aria-drawer"))) {
      expect(drawerRoot.open).toBe(false);
    }

    const defaultRoot = rootByVariant("default");
    const defaultTrigger = defaultRoot.querySelector<HTMLElement>("aria-drawer-trigger")!;
    const defaultContent = portalledContent(defaultRoot);
    expect(defaultContent.hidden).toBe(true);
    defaultTrigger.click();
    await flush();
    expect(defaultRoot.open).toBe(true);
    expect(defaultContent.hidden).toBe(false);
    expect(defaultContent.getAttribute("role")).toBe("dialog");
    expect(defaultContent.getAttribute("data-side")).toBe("right");
    expect(document.activeElement).toBe(defaultContent.querySelector<HTMLInputElement>("#drawer-demo-name"));
    defaultContent.querySelector<HTMLElement>("aria-drawer-cancel")!.click();
    await flush();
    expect(defaultRoot.open).toBe(false);
    expect(document.activeElement).toBe(defaultTrigger);

    const sideRoot = rootByVariant("sides", 2);
    const sideContent = portalledContent(sideRoot);
    expect(sideContent.hidden).toBe(true);
    sideRoot.querySelector<HTMLElement>("aria-drawer-trigger")!.click();
    await flush();
    expect(sideRoot.open).toBe(true);
    expect(sideContent.hidden).toBe(false);
    expect(sideContent.getAttribute("data-side")).toBe("bottom");
    sideContent.querySelector<HTMLElement>("aria-drawer-close")!.click();
    await flush();
    expect(sideRoot.open).toBe(false);

    const motionCases = [
      {
        index: 0,
        side: "top",
        enter: ["translateY(-100%)", "translateY(0%)"],
        exit: ["translateY(0%)", "translateY(-100%)"],
      },
      {
        index: 1,
        side: "right",
        enter: ["translateX(100%)", "translateX(0%)"],
        exit: ["translateX(0%)", "translateX(100%)"],
      },
      {
        index: 2,
        side: "bottom",
        enter: ["translateY(100%)", "translateY(0%)"],
        exit: ["translateY(0%)", "translateY(100%)"],
      },
      {
        index: 3,
        side: "left",
        enter: ["translateX(-100%)", "translateX(0%)"],
        exit: ["translateX(0%)", "translateX(-100%)"],
      },
    ];
    for (const motionCase of motionCases) {
      animateMock.mockClear();
      const motionRoot = rootByVariant("framer-motion", motionCase.index);
      const motionTrigger = motionRoot.querySelector<HTMLElement>("aria-drawer-trigger")!;
      const motionContent = portalledContent(motionRoot);
      const motionOverlay = portalledOverlayPart(motionRoot, "[data-drawer-motion-overlay]");
      expect(motionContent.hasAttribute("data-drawer-motion-content")).toBe(true);
      expect(motionContent.getAttribute("data-side")).toBe(motionCase.side);
      expect(motionContent.hidden).toBe(false);
      expect(motionContent.style.opacity).toBe("0");
      expect(motionContent.style.pointerEvents).toBe("none");
      expect(motionOverlay.style.opacity).toBe("0");
      motionTrigger.click();
      await flush();
      expect(motionRoot.open).toBe(true);
      expect(animateMock).toHaveBeenCalledWith(motionOverlay, { opacity: [0, 1] }, { duration: 0.22, ease: "easeOut" });
      expect(animateMock).toHaveBeenCalledWith(
        motionContent,
        { opacity: [0, 1], transform: motionCase.enter },
        { duration: 0.22, ease: "easeOut" },
      );
      animateMock.mockClear();
      motionContent.querySelector<HTMLElement>("aria-drawer-cancel")!.click();
      await flush();
      expect(motionRoot.open).toBe(false);
      expect(motionContent.hidden).toBe(false);
      expect(motionContent.style.pointerEvents).toBe("none");
      expect(animateMock).toHaveBeenCalledWith(
        motionContent,
        { opacity: [1, 0], transform: motionCase.exit },
        { duration: 0.22, ease: "easeOut" },
      );
    }
  });
});
