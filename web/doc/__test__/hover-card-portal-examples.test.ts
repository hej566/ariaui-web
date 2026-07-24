import { defineHoverCardElements } from "@ariaui-web/hover-card";
import { afterEach, describe, expect, it, vi } from "vitest";
import { installHoverCardExamples } from "../docs/.vitepress/theme/hover-card-examples";

const { animateMock } = vi.hoisted(() => ({ animateMock: vi.fn() }));
vi.mock("framer-motion/dom", () => ({ animate: animateMock }));

describe("Hover Card docs examples with portalled content", () => {
  afterEach(() => {
    document.body.replaceChildren();
    animateMock.mockReset();
    vi.unstubAllGlobals();
  });

  it("binds the motion example when content is already portalled to document.body", async () => {
    animateMock.mockImplementation(() => ({
      stop: vi.fn(),
      then: (resolve: () => void) => Promise.resolve().then(resolve),
    }));
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
    defineHoverCardElements();
    document.body.innerHTML = `<div data-component="hover-card" data-example-variant="framer-motion">
      <aria-hover-card data-hover-card-motion>
        <aria-hover-card-trigger>Hover me</aria-hover-card-trigger>
        <aria-hover-card-content>Card content</aria-hover-card-content>
      </aria-hover-card>
    </div>`;
    await new Promise<void>((resolve) =>
      queueMicrotask(() => queueMicrotask(resolve)),
    );

    const root = document.querySelector<HTMLElement & { open: boolean }>(
      "aria-hover-card",
    )!;
    const content = document.body.querySelector<HTMLElement>(
      ":scope > aria-hover-card-content",
    )!;
    expect(content).toBeTruthy();
    expect(root.querySelector("aria-hover-card-content")).toBeNull();

    installHoverCardExamples(document);
    const trigger = root.querySelector<HTMLElement>("aria-hover-card-trigger")!;

    trigger.dispatchEvent(new MouseEvent("mouseenter"));
    expect(root.open).toBe(true);
    expect(animateMock).toHaveBeenLastCalledWith(
      content,
      { opacity: [0, 1], y: [8, 0], scale: [0.96, 1] },
      { duration: 0.18, ease: "easeOut" },
    );
  });
});
