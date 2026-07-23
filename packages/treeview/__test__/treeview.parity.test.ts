import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { defineTreeviewElements } from "../src";

function mount(attributes = "") {
  const host = document.createElement("div");
  host.innerHTML = `<aria-treeview ${attributes} aria-label="Files">
    <aria-treeview-item value="projects">Projects <aria-treeview-toggle>toggle</aria-treeview-toggle>
      <aria-treeview-group>
        <aria-treeview-item value="alpha">Alpha</aria-treeview-item>
        <aria-treeview-item value="beta">Beta</aria-treeview-item>
      </aria-treeview-group>
    </aria-treeview-item>
    <aria-treeview-item value="notes">Notes</aria-treeview-item>
    <aria-treeview-item value="disabled" disabled>Disabled</aria-treeview-item>
  </aria-treeview>`;
  document.body.append(host);
  return host.querySelector("aria-treeview") as HTMLElement;
}

function item(root: HTMLElement, value: string) {
  return root.querySelector<HTMLElement>(`[value="${value}"]`)!;
}

function key(target: HTMLElement, value: string, init: KeyboardEventInit = {}) {
  target.dispatchEvent(new KeyboardEvent("keydown", { key: value, bubbles: true, ...init }));
}

describe("@ariaui-web/treeview upstream behavior parity", () => {
  beforeAll(() => defineTreeviewElements());
  afterEach(() => document.body.replaceChildren());

  it("computes hierarchy, expansion, visibility, and one roving tab stop", async () => {
    const root = mount();
    await vi.waitFor(() => expect(item(root, "projects").getAttribute("aria-expanded")).toBe("false"));
    expect(root.getAttribute("role")).toBe("tree");
    expect(item(root, "projects").getAttribute("aria-level")).toBe("1");
    expect(item(root, "alpha").getAttribute("aria-level")).toBe("2");
    expect(item(root, "notes").hasAttribute("aria-expanded")).toBe(false);
    expect(item(root, "alpha").hidden).toBe(true);
    expect(root.querySelectorAll('[tabindex="0"]')).toHaveLength(1);
  });

  it("toggles a parent from its row and toggle without selecting it", async () => {
    const root = mount();
    await vi.waitFor(() => expect(item(root, "projects").getAttribute("aria-expanded")).toBe("false"));
    item(root, "projects").click();
    expect(item(root, "projects").getAttribute("aria-expanded")).toBe("true");
    expect(root.getAttribute("value")).toBeNull();
    root.querySelector<HTMLElement>("aria-treeview-toggle")!.click();
    expect(item(root, "projects").getAttribute("aria-expanded")).toBe("false");
  });

  it("selects leaves but keeps focus movement independent from selection", async () => {
    const root = mount('default-expanded="projects"');
    await vi.waitFor(() => expect(item(root, "alpha").hidden).toBe(false));
    item(root, "alpha").focus();
    key(item(root, "alpha"), "ArrowDown");
    expect(document.activeElement).toBe(item(root, "beta"));
    expect(root.hasAttribute("value")).toBe(false);
    key(item(root, "beta"), " ");
    expect(root.getAttribute("value")).toBe("beta");
    expect(item(root, "beta").getAttribute("data-selected")).toBe("true");
    key(item(root, "beta"), "Enter");
    expect(root.getAttribute("value")).toBe("");
  });

  it("supports tree navigation, typeahead, and skips disabled items", async () => {
    const root = mount('default-expanded="projects"');
    await vi.waitFor(() => expect(item(root, "alpha").hidden).toBe(false));
    item(root, "projects").focus();
    key(item(root, "projects"), "End");
    expect(document.activeElement).toBe(item(root, "notes"));
    key(item(root, "notes"), "a");
    expect(document.activeElement).toBe(item(root, "alpha"));
    key(item(root, "alpha"), "ArrowLeft");
    expect(document.activeElement).toBe(item(root, "projects"));
    key(item(root, "projects"), "ArrowLeft");
    expect(item(root, "projects").getAttribute("aria-expanded")).toBe("false");
    key(item(root, "projects"), "ArrowRight");
    expect(item(root, "projects").getAttribute("aria-expanded")).toBe("true");
  });

  it("supports multi-select toggles, ranges, and select all", async () => {
    const root = mount('multi-select default-expanded="projects"');
    await vi.waitFor(() => expect(root.getAttribute("aria-multiselectable")).toBe("true"));
    item(root, "alpha").click();
    item(root, "notes").dispatchEvent(new MouseEvent("click", { bubbles: true, shiftKey: true }));
    expect(root.getAttribute("value")?.split(",")).toEqual(["alpha", "beta", "notes"]);
    key(item(root, "notes"), "a", { ctrlKey: true });
    expect(root.getAttribute("value")?.split(",")).toEqual(["projects", "alpha", "beta", "notes"]);
  });

  it("honors controlled state and emits cancelable change events", async () => {
    const root = mount('expanded="" value=""');
    const onExpanded = vi.fn();
    (root as HTMLElement & { onExpandedChange: (value: string[]) => void }).onExpandedChange = onExpanded;
    await vi.waitFor(() => expect(item(root, "projects").getAttribute("aria-expanded")).toBe("false"));
    item(root, "projects").click();
    expect(onExpanded).toHaveBeenCalledWith(["projects"]);
    expect(root.getAttribute("expanded")).toBe("");
    expect(item(root, "projects").getAttribute("aria-expanded")).toBe("false");
  });

  it("suppresses interaction for disabled roots and items", async () => {
    const root = mount("disabled");
    await vi.waitFor(() => expect(item(root, "projects").getAttribute("aria-expanded")).toBe("false"));
    item(root, "projects").click();
    expect(item(root, "projects").getAttribute("aria-expanded")).toBe("false");
    expect(item(root, "disabled").getAttribute("tabindex")).toBe("-1");
  });

  it("derives parent checkbox state and toggles descendant checkbox values", async () => {
    const host = document.createElement("div");
    host.innerHTML = `<aria-treeview multi-select default-expanded="team">
      <aria-treeview-checkbox-item value="team">Team <aria-treeview-toggle>toggle</aria-treeview-toggle>
        <aria-treeview-group>
          <aria-treeview-checkbox-item value="ada">Ada</aria-treeview-checkbox-item>
          <aria-treeview-checkbox-item value="lin">Lin</aria-treeview-checkbox-item>
        </aria-treeview-group>
      </aria-treeview-checkbox-item>
    </aria-treeview>`;
    document.body.append(host);
    const root = host.querySelector("aria-treeview") as HTMLElement;
    await vi.waitFor(() => expect(item(root, "team").getAttribute("aria-checked")).toBe("false"));
    item(root, "ada").click();
    expect(item(root, "team").getAttribute("aria-checked")).toBe("mixed");
    item(root, "team").click();
    expect(root.getAttribute("value")?.split(",")).toEqual(["ada", "team", "lin"]);
    expect(item(root, "team").getAttribute("data-state")).toBe("checked");
  });

  it("keeps native-composed collapsed branches mounted and out of navigation", async () => {
    const host = document.createElement("div");
    host.innerHTML = `<aria-treeview><aria-treeview-item value="parent">Parent
      <aria-treeview-group native-composition><div><aria-treeview-item value="child">Child</aria-treeview-item></div></aria-treeview-group>
    </aria-treeview-item><aria-treeview-item value="next">Next</aria-treeview-item></aria-treeview>`;
    document.body.append(host);
    const root = host.querySelector("aria-treeview") as HTMLElement;
    const motion = root.querySelector("aria-treeview-group > div") as HTMLElement;
    await vi.waitFor(() => expect(motion.getAttribute("aria-hidden")).toBe("true"));
    expect(motion.hidden).toBe(false);
    item(root, "parent").focus();
    key(item(root, "parent"), "ArrowDown");
    expect(document.activeElement).toBe(item(root, "next"));
  });
});
