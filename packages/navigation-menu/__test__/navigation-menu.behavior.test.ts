import { afterEach, describe, expect, it, vi } from "vitest";
import { defineNavigationMenuElements } from "../src";
import { computeNavigationMenuPosition, positionNavigationMenuContent, stopNavigationMenuPositioning } from "../src/navigation-menu-position";
import { navigationMenuForceSyncRoot } from "../src/navigation-menu-sync";

type NavElement = HTMLElement & { value: string };

function mouseOver(element: Element) {
  element.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, relatedTarget: null }));
}

function mouseOut(element: Element, relatedTarget: Element | null = null) {
  element.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget }));
}

function keyDown(element: Element, key: string) {
  element.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key }));
}

function defineRect(element: Element, rect: Partial<DOMRect>) {
  const full = {
    bottom: rect.bottom ?? (rect.top ?? 0) + (rect.height ?? 0),
    height: rect.height ?? ((rect.bottom ?? 0) - (rect.top ?? 0)),
    left: rect.left ?? 0,
    right: rect.right ?? (rect.left ?? 0) + (rect.width ?? 0),
    top: rect.top ?? 0,
    width: rect.width ?? ((rect.right ?? 0) - (rect.left ?? 0)),
    x: rect.left ?? 0,
    y: rect.top ?? 0,
    toJSON: () => ({}),
  } as DOMRect;
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue(full);
}

function setupNavigationMenu() {
  defineNavigationMenuElements();
  document.body.innerHTML = `
    <aria-navigation-menu>
      <aria-navigation-menu-list aria-label="Main navigation">
        <aria-navigation-menu-item value="getting-started">
          <aria-navigation-menu-trigger>Getting Started</aria-navigation-menu-trigger>
          <aria-navigation-menu-content>
            <aria-navigation-menu-link href="/docs">Introduction</aria-navigation-menu-link>
            <aria-navigation-menu-link href="/docs/installation">Installation</aria-navigation-menu-link>
            <aria-navigation-menu-sub>
              <aria-navigation-menu-sub-trigger>Guides</aria-navigation-menu-sub-trigger>
              <aria-navigation-menu-sub-content>
                <aria-navigation-menu-link href="/docs/forms">Forms</aria-navigation-menu-link>
                <aria-navigation-menu-link href="/docs/keyboard">Keyboard</aria-navigation-menu-link>
              </aria-navigation-menu-sub-content>
            </aria-navigation-menu-sub>
          </aria-navigation-menu-content>
        </aria-navigation-menu-item>
        <aria-navigation-menu-item value="components">
          <aria-navigation-menu-trigger>Components</aria-navigation-menu-trigger>
          <aria-navigation-menu-content>
            <aria-navigation-menu-link href="/docs/components/dialog">Dialog</aria-navigation-menu-link>
            <aria-navigation-menu-link href="/docs/components/tooltip">Tooltip</aria-navigation-menu-link>
          </aria-navigation-menu-content>
        </aria-navigation-menu-item>
        <aria-navigation-menu-item>
          <aria-navigation-menu-link href="/docs">Documentation</aria-navigation-menu-link>
        </aria-navigation-menu-item>
      </aria-navigation-menu-list>
    </aria-navigation-menu>
  `;

  const root = document.querySelector<NavElement>("aria-navigation-menu")!;
  const list = root.querySelector<HTMLElement>("aria-navigation-menu-list")!;
  const items = Array.from(root.querySelectorAll<HTMLElement>("aria-navigation-menu-list > aria-navigation-menu-item"));
  const triggers = Array.from(root.querySelectorAll<HTMLElement>("aria-navigation-menu-trigger"));
  const contents = Array.from(root.querySelectorAll<HTMLElement>("aria-navigation-menu-content"));
  const topLink = root.querySelector<HTMLElement>("aria-navigation-menu-list > aria-navigation-menu-item:last-child aria-navigation-menu-link")!;
  const links = Array.from(contents[0]!.querySelectorAll<HTMLElement>("aria-navigation-menu-link"));
  const sub = root.querySelector<HTMLElement>("aria-navigation-menu-sub")!;
  const subTrigger = root.querySelector<HTMLElement>("aria-navigation-menu-sub-trigger")!;
  const subContent = root.querySelector<HTMLElement>("aria-navigation-menu-sub-content")!;
  const subLinks = Array.from(subContent.querySelectorAll<HTMLElement>("aria-navigation-menu-link"));

  return { contents, items, links, list, root, sub, subContent, subLinks, subTrigger, topLink, triggers };
}

describe("@ariaui-web/navigation-menu behavior", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("syncs menubar roles, ARIA linkage, hover open, link item state, and non-toggle click persistence", () => {
    const { contents, items, list, root, topLink, triggers } = setupNavigationMenu();

    expect(root.getAttribute("role")).toBe("navigation");
    expect(list.getAttribute("role")).toBe("menubar");
    expect(triggers[0]?.getAttribute("role")).toBe("menuitem");
    expect(triggers[0]?.getAttribute("aria-haspopup")).toBe("menu");
    expect(triggers[0]?.getAttribute("aria-expanded")).toBe("false");
    expect(triggers[0]?.getAttribute("aria-controls")).toBe(contents[0]?.id);
    expect(triggers[0]?.getAttribute("data-ariaui-navigation-menu-value")).toBe("getting-started");
    expect(contents[0]?.getAttribute("role")).toBe("menu");
    expect(contents[0]?.hasAttribute("data-ariaui-navigation-menu-content")).toBe(true);
    expect(contents[0]?.hidden).toBe(true);

    mouseOver(triggers[0]!);

    expect(root.value).toBe("getting-started");
    expect(root.getAttribute("data-open-mode")).toBe("hover");
    expect(root.hasAttribute("open")).toBe(true);
    expect(triggers[0]?.getAttribute("aria-expanded")).toBe("true");
    expect(triggers[0]?.getAttribute("data-state")).toBe("open");
    expect(contents[0]?.hidden).toBe(false);

    mouseOut(triggers[0]!, contents[0]!);
    expect(root.value).toBe("");
    expect(contents[0]?.hidden).toBe(true);

    triggers[0]!.click();
    expect(root.value).toBe("getting-started");
    expect(root.getAttribute("data-open-mode")).toBe("click");
    mouseOut(triggers[0]!);
    mouseOut(contents[0]!);
    expect(root.value).toBe("getting-started");

    triggers[0]!.click();
    expect(root.value).toBe("getting-started");

    document.body.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    expect(root.value).toBe("");
    expect(root.hasAttribute("open")).toBe(false);

    mouseOver(topLink);
    expect(root.value).toBe("documentation");
    expect(items.map((item) => item.getAttribute("data-state"))).toEqual(["closed", "closed", "open"]);

    mouseOut(topLink);
    expect(root.value).toBe("");
    expect(items.map((item) => item.getAttribute("data-state"))).toEqual(["closed", "closed", "closed"]);
  });

  it("keeps repeated closed-panel syncs idempotent", async () => {
    const { root } = setupNavigationMenu();
    const records: MutationRecord[] = [];
    const observer = new MutationObserver((mutations) => records.push(...mutations));
    observer.observe(root, { attributeFilter: ["hidden"], attributes: true, subtree: true });

    navigationMenuForceSyncRoot(root);
    await Promise.resolve();
    records.length = 0;

    navigationMenuForceSyncRoot(root);
    await Promise.resolve();
    observer.disconnect();

    expect(records).toHaveLength(0);
  });

  it("keeps repeated open-panel positioning idempotent", async () => {
    const { contents, triggers } = setupNavigationMenu();
    const trigger = triggers[0]!;
    const content = contents[0]!;
    defineRect(trigger, { bottom: 76, height: 36, left: 120, right: 260, top: 40, width: 140 });
    defineRect(content, { height: 220, left: 0, top: 0, width: 512 });

    mouseOver(trigger);
    await Promise.resolve();

    const records: MutationRecord[] = [];
    const observer = new MutationObserver((mutations) => records.push(...mutations));
    observer.observe(content, { attributeFilter: ["style"], attributes: true });
    positionNavigationMenuContent(trigger, content, "content");
    await Promise.resolve();
    observer.disconnect();
    stopNavigationMenuPositioning(content);

    expect(records).toHaveLength(0);
  });

  it("keeps a flipped panel side after sync", async () => {
    const { contents, root, triggers } = setupNavigationMenu();
    const trigger = triggers[0]!;
    const content = contents[0]!;
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(260);
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);
    defineRect(trigger, { bottom: 76, height: 36, left: 120, right: 260, top: 40, width: 140 });
    defineRect(content, { height: 220, left: 0, top: 0, width: 512 });

    mouseOver(trigger);
    await Promise.resolve();
    expect(content.getAttribute("data-side")).toBe("top");

    const records: MutationRecord[] = [];
    const observer = new MutationObserver((mutations) => records.push(...mutations));
    observer.observe(content, { attributeFilter: ["data-side"], attributes: true });
    navigationMenuForceSyncRoot(root);
    await Promise.resolve();
    observer.disconnect();

    expect(content.getAttribute("data-side")).toBe("top");
    expect(records).toHaveLength(0);
  });

  it("translates absolute panel coordinates through the offset parent", () => {
    const { contents, triggers } = setupNavigationMenu();
    const trigger = triggers[1]!;
    const content = contents[1]!;
    const offsetParent = document.createElement("div");
    document.body.append(offsetParent);

    vi.spyOn(window, "innerHeight", "get").mockReturnValue(900);
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1280);
    defineRect(trigger, { bottom: 886, height: 36, left: 924, right: 1064, top: 850, width: 140 });
    defineRect(content, { height: 334, left: 0, top: 0, width: 512 });
    defineRect(offsetParent, { height: 1200, left: 164, top: -132, width: 960 });
    Object.defineProperty(content, "offsetParent", {
      configurable: true,
      get: () => offsetParent,
    });

    positionNavigationMenuContent(trigger, content, "content");
    stopNavigationMenuPositioning(content);

    expect(content.style.position).toBe("absolute");
    expect(content.getAttribute("data-side")).toBe("top");
    expect(content.style.left).toBe("760px");
    expect(content.style.top).toBe("643px");
    expect(content.style.maxWidth).toBe("348px");
  });

  it("moves focus through top-level items and opens content from trigger keys", () => {
    const { contents, links, root, subTrigger, topLink, triggers } = setupNavigationMenu();

    triggers[0]!.focus();
    keyDown(triggers[0]!, "ArrowRight");
    expect(document.activeElement).toBe(triggers[1]);

    keyDown(triggers[1]!, "ArrowRight");
    expect(document.activeElement).toBe(topLink);

    keyDown(topLink, "Home");
    expect(document.activeElement).toBe(triggers[0]);

    keyDown(triggers[0]!, "c");
    expect(document.activeElement).toBe(triggers[1]);

    keyDown(triggers[1]!, ".");
    expect(document.activeElement).toBe(triggers[1]);

    keyDown(triggers[1]!, "ArrowDown");
    expect(root.value).toBe("components");
    expect(contents[1]?.hidden).toBe(false);
    expect(document.activeElement).toBe(contents[1]?.querySelector("aria-navigation-menu-link"));

    keyDown(document.activeElement!, "ArrowLeft");
    expect(root.value).toBe("getting-started");
    expect(document.activeElement).toBe(triggers[0]);

    keyDown(triggers[0]!, "ArrowDown");
    expect(document.activeElement).toBe(links[0]);
    keyDown(links[0]!, "End");
    expect(document.activeElement).toBe(subTrigger);
    keyDown(subTrigger, "Escape");
    expect(root.value).toBe("");
    expect(document.activeElement).toBe(triggers[0]);
  });

  it("syncs focused bar items from the current open or closed bar state", () => {
    const { contents, items, root, topLink, triggers } = setupNavigationMenu();

    triggers[0]!.focus();
    expect(root.value).toBe("");
    expect(contents[0]?.hidden).toBe(true);
    expect(items.map((item) => item.getAttribute("data-state"))).toEqual(["closed", "closed", "closed"]);

    keyDown(triggers[0]!, "ArrowRight");
    expect(document.activeElement).toBe(triggers[1]);
    expect(root.value).toBe("");
    expect(contents[1]?.hidden).toBe(true);

    triggers[0]!.click();
    expect(root.value).toBe("getting-started");
    expect(contents[0]?.hidden).toBe(false);
    expect(items.map((item) => item.getAttribute("data-state"))).toEqual(["open", "closed", "closed"]);

    keyDown(triggers[0]!, "ArrowRight");
    expect(document.activeElement).toBe(triggers[1]);
    expect(root.value).toBe("components");
    expect(contents[0]?.hidden).toBe(true);
    expect(contents[1]?.hidden).toBe(false);
    expect(items.map((item) => item.getAttribute("data-state"))).toEqual(["closed", "open", "closed"]);

    keyDown(triggers[1]!, "ArrowRight");
    expect(document.activeElement).toBe(topLink);
    expect(root.value).toBe("documentation");
    expect(contents.every((content) => content.hidden)).toBe(true);
    expect(items.map((item) => item.getAttribute("data-state"))).toEqual(["closed", "closed", "open"]);

    keyDown(topLink, "ArrowLeft");
    expect(document.activeElement).toBe(triggers[1]);
    expect(root.value).toBe("components");
    expect(contents[1]?.hidden).toBe(false);
    expect(items.map((item) => item.getAttribute("data-state"))).toEqual(["closed", "open", "closed"]);
  });

  it("matches source data attributes, form guard, and native composition surfaces", () => {
    defineNavigationMenuElements();
    document.body.innerHTML = `
      <form>
        <aria-navigation-menu>
          <aria-navigation-menu-list>
            <aria-navigation-menu-item value="products">
              <aria-navigation-menu-trigger value="submit">Products</aria-navigation-menu-trigger>
              <aria-navigation-menu-content native-composition class="menu-shell">
                <div class="panel-shell">
                  <aria-navigation-menu-link href="/overview" active>Overview</aria-navigation-menu-link>
                  <aria-navigation-menu-sub>
                    <aria-navigation-menu-sub-trigger>Categories</aria-navigation-menu-sub-trigger>
                    <aria-navigation-menu-sub-content native-composition class="sub-shell">
                      <div class="sub-panel-shell">
                        <aria-navigation-menu-link href="/electronics">Electronics</aria-navigation-menu-link>
                      </div>
                    </aria-navigation-menu-sub-content>
                  </aria-navigation-menu-sub>
                </div>
              </aria-navigation-menu-content>
            </aria-navigation-menu-item>
          </aria-navigation-menu-list>
        </aria-navigation-menu>
      </form>
    `;

    const form = document.querySelector("form")!;
    const root = form.querySelector<NavElement>("aria-navigation-menu")!;
    const item = root.querySelector<HTMLElement>("aria-navigation-menu-item")!;
    const trigger = root.querySelector<HTMLElement>("aria-navigation-menu-trigger")!;
    const content = root.querySelector<HTMLElement>("aria-navigation-menu-content")!;
    const contentHost = content.firstElementChild as HTMLElement;
    const link = content.querySelector<HTMLElement>("aria-navigation-menu-link")!;
    const sub = content.querySelector<HTMLElement>("aria-navigation-menu-sub")!;
    const subTrigger = content.querySelector<HTMLElement>("aria-navigation-menu-sub-trigger")!;
    const subContent = content.querySelector<HTMLElement>("aria-navigation-menu-sub-content")!;
    const subContentHost = subContent.firstElementChild as HTMLElement;
    let submits = 0;
    form.addEventListener("submit", (event) => {
      submits += 1;
      event.preventDefault();
    });

    trigger.click();
    expect(submits).toBe(0);
    expect(root.value).toBe("products");
    expect(item.getAttribute("data-state")).toBe("open");
    expect(trigger.getAttribute("data-ariaui-navigation-menu-value")).toBe("products");
    expect(contentHost.getAttribute("role")).toBe("menu");
    expect(contentHost.getAttribute("tabindex")).toBe("-1");
    expect(contentHost.hasAttribute("data-ariaui-navigation-menu-content")).toBe(true);
    expect(contentHost.classList.contains("menu-shell")).toBe(true);
    expect(contentHost.style.position).toBe("absolute");
    expect(link.getAttribute("role")).toBe("menuitem");
    expect(link.getAttribute("tabindex")).toBe("-1");
    expect(link.getAttribute("aria-current")).toBe("page");

    mouseOver(subTrigger);
    expect(sub.hasAttribute("open")).toBe(true);
    expect(subTrigger.getAttribute("data-state")).toBe("open");
    expect(subTrigger.getAttribute("tabindex")).toBe("-1");
    expect(subContentHost.getAttribute("role")).toBe("menu");
    expect(subContentHost.hasAttribute("data-ariaui-navigation-menu-subcontent")).toBe(true);
    expect(subContentHost.classList.contains("sub-shell")).toBe(true);
    expect(subContentHost.style.position).toBe("absolute");
  });

  it("keeps buffered typeahead on the current matching content item", () => {
    defineNavigationMenuElements();
    document.body.innerHTML = `
      <aria-navigation-menu>
        <aria-navigation-menu-list>
          <aria-navigation-menu-item value="plants">
            <aria-navigation-menu-trigger>Plants</aria-navigation-menu-trigger>
            <aria-navigation-menu-content>
              <aria-navigation-menu-link href="/apple">Apple</aria-navigation-menu-link>
              <aria-navigation-menu-link href="/orange">Orange</aria-navigation-menu-link>
              <aria-navigation-menu-link href="/orchid">Orchid</aria-navigation-menu-link>
            </aria-navigation-menu-content>
          </aria-navigation-menu-item>
        </aria-navigation-menu-list>
      </aria-navigation-menu>
    `;

    const root = document.querySelector<NavElement>("aria-navigation-menu")!;
    const trigger = root.querySelector<HTMLElement>("aria-navigation-menu-trigger")!;
    const content = root.querySelector<HTMLElement>("aria-navigation-menu-content")!;
    const links = Array.from(content.querySelectorAll<HTMLElement>("aria-navigation-menu-link"));

    trigger.focus();
    keyDown(trigger, "ArrowDown");
    expect(document.activeElement).toBe(links[0]);

    keyDown(links[0]!, "o");
    expect(document.activeElement).toBe(links[1]);

    keyDown(links[1]!, "r");
    expect(document.activeElement).toBe(links[1]);

    keyDown(links[1]!, ".");
    expect(document.activeElement).toBe(links[1]);
  });

  it("uses RTL-aware trigger and content switching", () => {
    const { root, triggers } = setupNavigationMenu();
    root.setAttribute("dir", "rtl");

    triggers[0]!.focus();
    keyDown(triggers[0]!, "ArrowLeft");
    expect(document.activeElement).toBe(triggers[1]);

    keyDown(triggers[1]!, "ArrowDown");
    keyDown(document.activeElement!, "ArrowRight");

    expect(root.value).toBe("getting-started");
    expect(document.activeElement).toBe(triggers[0]);
  });

  it("opens nested submenus with pointer and keyboard without stealing hover focus", () => {
    const { root, sub, subContent, subLinks, subTrigger, triggers } = setupNavigationMenu();

    triggers[0]!.focus();
    mouseOver(triggers[0]!);
    expect(document.activeElement).toBe(triggers[0]);

    mouseOver(subTrigger);
    expect(sub.hasAttribute("open")).toBe(true);
    expect(subTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(subContent.hidden).toBe(false);
    expect(document.activeElement).toBe(triggers[0]);

    subTrigger.focus();
    keyDown(subTrigger, "ArrowRight");
    expect(document.activeElement).toBe(subLinks[0]);

    keyDown(subLinks[0]!, "ArrowLeft");
    expect(sub.hasAttribute("open")).toBe(false);
    expect(document.activeElement).toBe(subTrigger);

    keyDown(subTrigger, "Enter");
    expect(document.activeElement).toBe(subLinks[0]);
    keyDown(subLinks[0]!, "Escape");
    expect(root.value).toBe("");
    expect(sub.hasAttribute("open")).toBe(false);
    expect(document.activeElement).toBe(triggers[0]);
  });

  it("anchors floating panels to their trigger and flips only against the viewport boundary", () => {
    const trigger = document.createElement("button");
    const content = document.createElement("div");

    defineRect(trigger, { bottom: 76, height: 36, left: 460, right: 580, top: 40, width: 120 });
    defineRect(content, { height: 220, left: 0, top: 0, width: 512 });

    expect(computeNavigationMenuPosition(
      trigger.getBoundingClientRect(),
      { height: 220, width: 512 },
      { height: 720, width: 1024 },
      "content",
    )).toMatchObject({ left: 460, side: "bottom", top: 81 });

    expect(computeNavigationMenuPosition(
      { bottom: 468, left: 390, right: 528, top: 432 },
      { height: 334, width: 512 },
      { height: 900, width: 900 },
      "content",
    )).toMatchObject({ left: 390, side: "bottom", top: 473 });

    expect(computeNavigationMenuPosition(
      trigger.getBoundingClientRect(),
      { height: 220, width: 512 },
      { height: 260, width: 1024 },
      "content",
    )).toMatchObject({ side: "top", top: 8 });

    expect(computeNavigationMenuPosition(
      { bottom: 220, left: 900, right: 980, top: 180 },
      { height: 120, width: 192 },
      { height: 720, width: 1024 },
      "subcontent",
    )).toMatchObject({ left: 706, side: "left", top: 176 });
  });
});
