import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineDropdownMenuElements } from "@ariaui-web/dropdown-menu";
import { afterEach, describe, expect, it } from "vitest";
import { installDropdownMenuExamples, syncDropdownMenuExamples } from "../docs/.vitepress/theme/dropdown-menu-examples";

const root = process.cwd();
const read = (...segments: string[]) => readFileSync(join(root, ...segments), "utf8");

type RuntimeElement = HTMLElement & { open: boolean; value: string };

function mountDropdownMenuExample() {
  defineDropdownMenuElements();
  document.body.innerHTML = `
    <div class="ariaui-web-preview" data-component="dropdown-menu">
      <aria-dropdown-menu class="ariaui-web-dropdown-menu-root">
        <aria-dropdown-menu-trigger class="ariaui-web-dropdown-menu-trigger">Open Menu</aria-dropdown-menu-trigger>
        <aria-dropdown-menu-content class="ariaui-web-dropdown-menu-content">
          <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" value="profile">Profile</aria-dropdown-menu-item>
          <aria-dropdown-menu-sub class="ariaui-web-dropdown-menu-sub">
            <aria-dropdown-menu-sub-trigger class="ariaui-web-dropdown-menu-sub-trigger">More</aria-dropdown-menu-sub-trigger>
            <aria-dropdown-menu-sub-content class="ariaui-web-dropdown-menu-sub-content">
              <aria-dropdown-menu-item class="ariaui-web-dropdown-menu-item" value="save-as">Save As</aria-dropdown-menu-item>
            </aria-dropdown-menu-sub-content>
          </aria-dropdown-menu-sub>
        </aria-dropdown-menu-content>
      </aria-dropdown-menu>
    </div>
  `;
  const menuRoot = document.querySelector<RuntimeElement>("aria-dropdown-menu")!;
  const trigger = document.querySelector<HTMLElement>("aria-dropdown-menu-trigger")!;
  const subTrigger = document.querySelector<HTMLElement>("aria-dropdown-menu-sub-trigger")!;
  return { menuRoot, trigger, subTrigger };
}

afterEach(() => {
  document.body.replaceChildren();
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
});

describe("Dropdown menu live examples", () => {
  it("keeps dropdown menu example styles applied to portalled panels", () => {
    const style = read("web", "doc", "docs", ".vitepress", "theme", "style.css");
    expect(style).toContain(".ariaui-web-dropdown-menu-content,\n.ariaui-web-dropdown-menu-sub-content {");
    expect(style).toContain(".ariaui-web-dropdown-menu-content[data-side],\n.ariaui-web-dropdown-menu-sub-content[data-side]");
    expect(style).toContain(".ariaui-web-breadcrumb-menu[data-side]");
    expect(style).not.toContain('.ariaui-web-preview[data-component="dropdown-menu"] .ariaui-web-dropdown-menu-content[data-side]');
    expect(style).not.toContain('.ariaui-web-preview[data-component="breadcrumb"] .ariaui-web-breadcrumb-menu[data-side]');
  });

  it("wraps the Full menu example items in a scroll area", () => {
    const page = read("web", "doc", "docs", "components", "dropdown-menu.md");
    const fullMenuStart = page.indexOf('data-example-variant="full-menu"');
    expect(fullMenuStart).toBeGreaterThan(-1);
    const fullMenuEnd = page.indexOf("### ", fullMenuStart);
    const fullMenu = page.slice(fullMenuStart, fullMenuEnd);

    for (const block of [fullMenu.split("```html")[0], fullMenu.split("```html")[1] ?? ""]) {
      const contentOpen = block.indexOf("<aria-dropdown-menu-content");
      const scrollAreaOpen = block.indexOf('<aria-scroll-area class="ariaui-web-dropdown-menu-scroll-area"');
      const viewportOpen = block.indexOf('<aria-scroll-area-viewport class="ariaui-web-dropdown-menu-scroll-viewport"');
      const firstGroup = block.indexOf("<aria-dropdown-menu-group");
      const viewportClose = block.indexOf("</aria-scroll-area-viewport>");
      const scrollAreaClose = block.indexOf("</aria-scroll-area>");
      const contentClose = block.indexOf("</aria-dropdown-menu-content>");

      expect(scrollAreaOpen).toBeGreaterThan(contentOpen);
      expect(viewportOpen).toBeGreaterThan(scrollAreaOpen);
      expect(firstGroup).toBeGreaterThan(viewportOpen);
      expect(viewportClose).toBeGreaterThan(firstGroup);
      expect(scrollAreaClose).toBeGreaterThan(viewportClose);
      expect(contentClose).toBeGreaterThan(scrollAreaClose);
    }

    const style = read("web", "doc", "docs", ".vitepress", "theme", "style.css");
    expect(style).toContain(".ariaui-web-dropdown-menu-content .ariaui-web-dropdown-menu-scroll-area {");
    expect(style).toContain(".ariaui-web-dropdown-menu-content .ariaui-web-dropdown-menu-scroll-viewport {");
    expect(style).toMatch(/\.ariaui-web-dropdown-menu-content \.ariaui-web-dropdown-menu-scroll-viewport \{[^}]*overflow-y: scroll !important;/);
    expect(style).toMatch(/\.ariaui-web-dropdown-menu-content \.ariaui-web-dropdown-menu-scroll-viewport \{[^}]*max-height: min\(/);
  });

  it("positions portalled root and submenu content", async () => {
    const { trigger, subTrigger } = mountDropdownMenuExample();
    installDropdownMenuExamples(document);
    await new Promise<void>((resolve) => queueMicrotask(() => queueMicrotask(resolve)));

    const content = document.querySelector<HTMLElement>("aria-dropdown-menu-content")!;
    const subContent = document.querySelector<HTMLElement>("aria-dropdown-menu-sub-content")!;
    expect(content.parentElement).toBe(document.body);
    expect(subContent.parentElement).toBe(document.body);

    trigger.click();
    syncDropdownMenuExamples(document);
    expect(content.hidden).toBe(false);
    expect(content.style.position).toBe("fixed");
    expect(content.dataset.side).toBe("bottom");

    subTrigger.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));
    syncDropdownMenuExamples(document);
    expect(subContent.hidden).toBe(false);
    expect(subContent.style.position).toBe("fixed");
    expect(subContent.dataset.side).toBe("right");

    document.body.click();
    syncDropdownMenuExamples(document);
    expect(content.hidden).toBe(true);
    expect(content.style.position).toBe("");
    expect(subContent.style.position).toBe("");
  });
});
