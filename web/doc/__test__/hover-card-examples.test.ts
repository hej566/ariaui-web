import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { defineHoverCardElements } from "@ariaui-web/hover-card";
import { afterEach, describe, expect, it, vi } from "vitest";
import { installHoverCardExamples } from "../docs/.vitepress/theme/hover-card-examples";

const { animateMock } = vi.hoisted(() => ({ animateMock: vi.fn() }));
vi.mock("framer-motion/dom", () => ({ animate: animateMock }));

const root = process.cwd();
const read = (...segments: string[]) =>
  readFileSync(join(root, ...segments), "utf8");

describe("Hover Card docs examples", () => {
  afterEach(() => {
    document.body.replaceChildren();
    animateMock.mockReset();
    vi.unstubAllGlobals();
  });

  it("keeps Framer Motion in docs and out of the package", () => {
    const docsPackage = JSON.parse(read("web", "doc", "package.json"));
    const hoverPackage = JSON.parse(
      read("packages", "hover-card", "package.json"),
    );
    const installerPath = join(
      root,
      "web",
      "doc",
      "docs",
      ".vitepress",
      "theme",
      "hover-card-examples.ts",
    );

    expect(docsPackage.dependencies["framer-motion"]).toBe("^12.38.0");
    expect(hoverPackage.dependencies?.["framer-motion"]).toBeUndefined();
    expect(existsSync(installerPath)).toBe(true);
    expect(readFileSync(installerPath, "utf8")).toContain(
      'from "framer-motion/dom"',
    );
    expect(
      read("packages", "hover-card", "src", "hover-card-element.ts"),
    ).not.toContain("framer-motion");
  });

  it("uses Framer Motion only for controlled entry and exit in the motion example", async () => {
    animateMock.mockImplementation(() => ({
      stop: vi.fn(),
      then: (resolve: () => void) => Promise.resolve().then(resolve),
    }));
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
    defineHoverCardElements();
    document.body.innerHTML = `<div data-component="hover-card" data-example-variant="default">
      <aria-hover-card>
        <aria-hover-card-trigger>Default</aria-hover-card-trigger>
        <aria-hover-card-content>Default content</aria-hover-card-content>
      </aria-hover-card>
    </div>
    <div data-component="hover-card" data-example-variant="framer-motion">
      <aria-hover-card data-hover-card-motion>
        <aria-hover-card-trigger>Hover me</aria-hover-card-trigger>
        <aria-hover-card-content>Card content</aria-hover-card-content>
      </aria-hover-card>
    </div>`;
    installHoverCardExamples(document);
    const roots = document.querySelectorAll<HTMLElement & { open: boolean }>(
      "aria-hover-card",
    );
    const defaultRoot = roots[0]!;
    const defaultTrigger = defaultRoot.querySelector<HTMLElement>(
      "aria-hover-card-trigger",
    )!;
    const root = roots[1]!;
    const trigger = root.querySelector<HTMLElement>("aria-hover-card-trigger")!;
    const content = root.querySelector<HTMLElement>("aria-hover-card-content")!;

    defaultTrigger.dispatchEvent(new MouseEvent("mouseenter"));
    expect(defaultRoot.open).toBe(true);
    expect(animateMock).not.toHaveBeenCalled();

    trigger.dispatchEvent(new MouseEvent("mouseenter"));
    expect(root.open).toBe(true);
    expect(animateMock).toHaveBeenLastCalledWith(
      content,
      { opacity: [0, 1], y: [8, 0], scale: [0.96, 1] },
      { duration: 0.18, ease: "easeOut" },
    );

    trigger.dispatchEvent(new MouseEvent("mouseleave"));
    await Promise.resolve();
    expect(animateMock).toHaveBeenLastCalledWith(
      content,
      { opacity: [1, 0], y: [0, 8], scale: [1, 0.96] },
      { duration: 0.18, ease: "easeOut" },
    );
    expect(content.style.pointerEvents).toBe("none");

    await Promise.resolve();
    await Promise.resolve();
    expect(root.open).toBe(false);
    expect(content.style.pointerEvents).toBe("");
  });
});
