import { defineContextMenuElements } from "@ariaui-web/context-menu";
import { afterEach, describe, expect, it, vi } from "vitest";

const { animateMock } = vi.hoisted(() => ({ animateMock: vi.fn() }));
vi.mock("framer-motion/dom", () => ({ animate: animateMock }));

import { installContextMenuExamples } from "../docs/.vitepress/theme/context-menu-examples";

type RuntimeElement = HTMLElement & {
  open: boolean;
};

type AnimationControl = {
  stop: ReturnType<typeof vi.fn>;
  resolve: () => void;
  then: (resolve: () => void) => Promise<void>;
};

function createAnimationControl() {
  let finish!: () => void;
  const finished = new Promise<void>((resolve) => {
    finish = resolve;
  });

  return {
    stop: vi.fn(),
    resolve: finish,
    then: (resolve: () => void) => finished.then(resolve),
  };
}

async function flush() {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await Promise.resolve();
}

afterEach(() => {
  animateMock.mockReset();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe("Context menu docs examples", () => {
  it("animates the Framer Motion submenu on open and close", async () => {
    const controls: AnimationControl[] = [];
    animateMock.mockImplementation(() => {
      const control = createAnimationControl();
      controls.push(control);
      return control;
    });
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
    defineContextMenuElements();
    document.body.innerHTML = `<div class="ariaui-web-preview" data-component="context-menu" data-example-variant="framer-motion">
      <div id="context-menu-motion-area">Open area</div>
      <aria-context-menu area="context-menu-motion-area">
        <aria-context-menu-content>
          <aria-context-menu-item value="back">Back</aria-context-menu-item>
          <aria-context-menu-sub>
            <aria-context-menu-sub-trigger>More Tools</aria-context-menu-sub-trigger>
            <aria-context-menu-sub-content class="ariaui-web-context-menu-motion-sub-content" hidden>
              <aria-context-menu-item value="save-as">Save Page As</aria-context-menu-item>
            </aria-context-menu-sub-content>
          </aria-context-menu-sub>
          <aria-context-menu-item value="bookmarks">Show Bookmarks</aria-context-menu-item>
        </aria-context-menu-content>
      </aria-context-menu>
    </div>`;

    installContextMenuExamples(document);

    const area = document.querySelector<HTMLElement>("#context-menu-motion-area")!;
    const sub = document.querySelector<RuntimeElement>("aria-context-menu-sub")!;
    const subTrigger = document.querySelector<HTMLElement>("aria-context-menu-sub-trigger")!;
    const subContent = document.querySelector<HTMLElement>("aria-context-menu-sub-content")!;
    const siblingItem = document.querySelector<HTMLElement>('aria-context-menu-item[value="bookmarks"]')!;

    area.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 80, clientY: 90 }));
    subTrigger.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));
    await flush();

    expect(sub.open).toBe(true);
    expect(subContent.hidden).toBe(false);
    expect(animateMock).toHaveBeenLastCalledWith(
      subContent,
      { opacity: [0, 1], scale: [0.96, 1] },
      { duration: 0.18, ease: "easeOut" },
    );

    siblingItem.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));
    await flush();

    expect(sub.open).toBe(false);
    expect(subContent.hidden).toBe(false);
    expect(subContent.getAttribute("aria-hidden")).toBe("true");
    expect(subContent.style.pointerEvents).toBe("none");
    expect(animateMock).toHaveBeenLastCalledWith(
      subContent,
      { opacity: [1, 0], scale: [1, 0.96] },
      { duration: 0.18, ease: "easeOut" },
    );

    controls.at(-1)?.resolve();
    await flush();

    expect(subContent.hidden).toBe(true);
    expect(subContent.hasAttribute("aria-hidden")).toBe(false);
    expect(subContent.style.pointerEvents).toBe("");
  });
});
