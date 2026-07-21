import { afterEach, describe, expect, it, vi } from "vitest";
import { componentSpec, defineSidebarElements } from "../src";

const flush = () => new Promise<void>((resolve) => queueMicrotask(resolve));
const expectAttribute = (element: Element | null, name: string, value?: string) => {
  expect(element).not.toBeNull();
  if (value === undefined) expect(element!.hasAttribute(name)).toBe(true);
  else expect(element!.getAttribute(name)).toBe(value);
};

function renderSidebar(attributes = "") {
  defineSidebarElements();
  document.body.innerHTML = `
    <aria-sidebar ${attributes}>
      <aria-sidebar-panel>
        <aria-sidebar-header></aria-sidebar-header>
        <aria-sidebar-content>
          <aria-sidebar-group>
            <aria-sidebar-group-label>Workspace</aria-sidebar-group-label>
            <aria-sidebar-group-action>Add</aria-sidebar-group-action>
            <aria-sidebar-group-content>
              <aria-sidebar-menu>
                <aria-sidebar-menu-item>
                  <aria-sidebar-menu-button active size="lg" variant="outline">Projects</aria-sidebar-menu-button>
                  <aria-sidebar-menu-action show-on-hover>More</aria-sidebar-menu-action>
                  <aria-sidebar-menu-badge>4</aria-sidebar-menu-badge>
                  <aria-sidebar-menu-sub>
                    <aria-sidebar-menu-sub-item>
                      <aria-sidebar-menu-sub-button active size="sm">Active</aria-sidebar-menu-sub-button>
                    </aria-sidebar-menu-sub-item>
                  </aria-sidebar-menu-sub>
                </aria-sidebar-menu-item>
              </aria-sidebar-menu>
            </aria-sidebar-group-content>
          </aria-sidebar-group>
        </aria-sidebar-content>
        <aria-sidebar-footer></aria-sidebar-footer>
      </aria-sidebar-panel>
      <aria-sidebar-rail></aria-sidebar-rail>
      <aria-sidebar-trigger>Toggle</aria-sidebar-trigger>
      <aria-sidebar-inset>Main</aria-sidebar-inset>
    </aria-sidebar>`;
  return document.querySelector("aria-sidebar") as HTMLElement;
}

describe("@ariaui-web/sidebar", () => {
  afterEach(() => document.body.replaceChildren());

  it("matches all upstream public parts and semantic roles", () => {
    expect(componentSpec.parts.map((part) => part.name)).toEqual([
      "Root", "Panel", "Trigger", "Rail", "Inset", "Header", "Content", "Footer", "Group",
      "GroupLabel", "GroupAction", "GroupContent", "Menu", "MenuItem", "MenuButton", "MenuAction",
      "MenuBadge", "MenuSub", "MenuSubItem", "MenuSubButton",
    ]);
    renderSidebar();
    for (const part of componentSpec.parts) expect(customElements.get(part.tagName)).toBeTruthy();
    expect(document.querySelector("aria-sidebar-panel")?.getAttribute("role")).toBe("complementary");
    expect(document.querySelector("aria-sidebar-inset")?.getAttribute("role")).toBe("main");
  });

  it("renders expanded by default with shadcn-compatible metadata", () => {
    const root = renderSidebar();
    const panel = document.querySelector("aria-sidebar-panel")!;
    const trigger = document.querySelector("aria-sidebar-trigger")!;
    expectAttribute(root, "data-state", "expanded");
    expectAttribute(root, "data-side", "left");
    expectAttribute(root, "data-collapsible", "icon");
    expectAttribute(panel, "data-sidebar", "sidebar");
    expectAttribute(trigger, "aria-expanded", "true");
    expectAttribute(trigger, "aria-controls", panel.id);
    expectAttribute(trigger, "data-state", "expanded");
    expectAttribute(document.querySelector("aria-sidebar-rail"), "data-state", "expanded");
    expectAttribute(document.querySelector("aria-sidebar-menu-button"), "data-variant", "outline");
    expectAttribute(document.querySelector("aria-sidebar-menu-sub-button"), "data-size", "sm");
  });

  it("honors collapsed defaults, side, panel id, and collapsible none", () => {
    let root = renderSidebar('default-open="false" side="right" panel-id="workspace"');
    expectAttribute(root, "data-state", "collapsed");
    expectAttribute(root, "data-side", "right");
    expectAttribute(document.querySelector("aria-sidebar-panel"), "id", "workspace");
    document.body.replaceChildren();
    root = renderSidebar('default-open="false" collapsible="none"');
    expectAttribute(root, "data-state", "expanded");
  });

  it("toggles uncontrolled state from trigger and rail", async () => {
    const root = renderSidebar('default-open="false"');
    const panel = document.querySelector("aria-sidebar-panel") as HTMLElement;
    (document.querySelector("aria-sidebar-trigger") as HTMLElement).click();
    await flush();
    expectAttribute(root, "data-state", "expanded");
    expect(panel.hidden).toBe(false);
    (document.querySelector("aria-sidebar-rail") as HTMLElement).click();
    await flush();
    expectAttribute(root, "data-state", "collapsed");
    expect(panel.hidden).toBe(false);
    (document.querySelector("aria-sidebar-trigger") as HTMLElement).click();
    await flush();
    expectAttribute(root, "data-state", "expanded");
    expect(panel.hidden).toBe(false);
  });

  it("emits a cancelable open-change event without mutating controlled state", async () => {
    const root = renderSidebar('open="false"');
    const listener = vi.fn();
    root.addEventListener("open-change", listener);
    (document.querySelector("aria-sidebar-trigger") as HTMLElement).click();
    await flush();
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]![0] as CustomEvent).detail.open).toBe(true);
    expectAttribute(root, "data-state", "collapsed");
  });

  it("reacts to controlled open and panel id attributes after connection", () => {
    const root = renderSidebar('default-open="false"');
    root.setAttribute("open", "");
    root.setAttribute("panel-id", "updated-panel");
    expectAttribute(root, "data-state", "expanded");
    expectAttribute(document.querySelector("aria-sidebar-panel"), "id", "updated-panel");
    root.setAttribute("open", "false");
    expectAttribute(root, "data-state", "collapsed");
  });

  it("respects prevented and disabled toggle clicks", async () => {
    const root = renderSidebar('default-open="false"');
    const trigger = document.querySelector("aria-sidebar-trigger") as HTMLElement;
    trigger.addEventListener("click", (event) => event.preventDefault());
    trigger.click();
    await flush();
    expectAttribute(root, "data-state", "collapsed");
    trigger.replaceWith(document.createElement("aria-sidebar-trigger"));
    const disabled = document.querySelector("aria-sidebar-trigger") as HTMLElement;
    disabled.setAttribute("disabled", "");
    disabled.click();
    await flush();
    expectAttribute(root, "data-state", "collapsed");
  });

  it("supports Ctrl and Meta shortcuts case-insensitively", () => {
    const root = renderSidebar('default-open="false" keyboard-shortcut="K"');
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
    expectAttribute(root, "data-state", "expanded");
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "K", metaKey: true }));
    expectAttribute(root, "data-state", "collapsed");
  });

  it("can disable shortcut handling and cleans up the listener", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const root = renderSidebar('default-open="false" keyboard-shortcut="none"');
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "b", ctrlKey: true }));
    expectAttribute(root, "data-state", "collapsed");
    root.remove();
    expect(remove).toHaveBeenCalledWith("keydown", expect.any(Function));
    remove.mockRestore();
  });

  it("rebinds shortcut handling when a root reconnects", () => {
    const root = renderSidebar('default-open="false" keyboard-shortcut="k"');
    root.remove();
    document.body.append(root);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
    expectAttribute(root, "data-state", "expanded");
  });

  it("composes supported parts into their first native child", () => {
    defineSidebarElements();
    document.body.innerHTML = `<aria-sidebar><aria-sidebar-panel native-composition class="panel"><aside aria-label="Primary"></aside></aria-sidebar-panel><aria-sidebar-trigger native-composition><button>Toggle</button></aria-sidebar-trigger></aria-sidebar>`;
    const aside = document.querySelector("aside")!;
    const button = document.querySelector("button")!;
    expect(aside.classList.contains("panel")).toBe(true);
    expectAttribute(aside, "data-sidebar", "sidebar");
    expectAttribute(button, "aria-expanded", "true");
    expect(aside.id).not.toBe("");
    expect(button.getAttribute("aria-controls")).toBe(aside.id);
    expect(document.querySelector("aria-sidebar-panel")?.hasAttribute("id")).toBe(false);
  });

  it("reflects all data slots and menu metadata", () => {
    renderSidebar('default-open="false"');
    expect(document.querySelectorAll("[data-slot]")).toHaveLength(19);
    expectAttribute(document.querySelector("aria-sidebar-menu-button"), "data-active", "true");
    expectAttribute(document.querySelector("aria-sidebar-menu-action"), "data-show-on-hover");
    expectAttribute(document.querySelector("aria-sidebar-menu-sub-button"), "data-state", "collapsed");
  });
});
