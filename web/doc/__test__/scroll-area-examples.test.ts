import { defineScrollAreaElements } from "@ariaui-web/scroll-area";
import { afterEach, describe, expect, it, vi } from "vitest";

const { animateMock } = vi.hoisted(() => ({ animateMock: vi.fn(() => ({})) }));
vi.mock("framer-motion/dom", () => ({ animate: animateMock }));

import { installScrollAreaExamples } from "../docs/.vitepress/theme/scroll-area-examples";

afterEach(() => {
  animateMock.mockClear();
  document.body.replaceChildren();
});

describe("Scroll Area live examples", () => {
  it("populates release tags and selects options in both picker examples", async () => {
    defineScrollAreaElements();
    document.body.innerHTML = `
      <div class="ariaui-web-preview" data-component="scroll-area" data-example-variant="default">
        <div data-scroll-area-tags></div>
      </div>
      <div class="ariaui-web-preview" data-component="scroll-area" data-example-variant="select-menu">
        <aria-scroll-area>
          <aria-scroll-area-scroll-up-button></aria-scroll-area-scroll-up-button>
          <aria-scroll-area-viewport role="listbox" max-visible-items="7" anchor-selected>
            <div role="option">Item 0</div><div role="option">Item 1</div><div role="option">Item 2</div><div role="option">Item 3</div>
          </aria-scroll-area-viewport>
          <aria-scroll-area-scroll-down-button></aria-scroll-area-scroll-down-button>
        </aria-scroll-area>
      </div>
      <div class="ariaui-web-preview" data-component="scroll-area" data-example-variant="framer-motion">
        <aria-scroll-area>
          <aria-scroll-area-scroll-up-button></aria-scroll-area-scroll-up-button>
          <aria-scroll-area-viewport native-composition><div role="listbox"><div role="option">Item 0</div><div role="option">Item 1</div><div role="option">Item 2</div><div role="option">Item 3</div></div></aria-scroll-area-viewport>
          <aria-scroll-area-scroll-down-button></aria-scroll-area-scroll-down-button>
        </aria-scroll-area>
      </div>
    `;
    installScrollAreaExamples(document);

    expect(document.querySelectorAll("[data-scroll-area-tags] > *")).toHaveLength(50);
    const selectOptions = Array.from(document.querySelectorAll<HTMLElement>('[data-example-variant="select-menu"] [role="option"]'));
    expect(selectOptions[3]?.getAttribute("aria-selected")).toBe("true");
    selectOptions[1]!.click();
    expect(selectOptions[1]?.getAttribute("aria-selected")).toBe("true");

    const motionViewport = document.querySelector<HTMLElement>('[data-example-variant="framer-motion"] [role="listbox"]')!;
    motionViewport.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true }));
    await Promise.resolve();
    const motionOptions = Array.from(motionViewport.querySelectorAll<HTMLElement>('[role="option"]'));
    expect(motionOptions[2]?.getAttribute("aria-selected")).toBe("true");
    expect(animateMock).toHaveBeenCalled();
  });
});
