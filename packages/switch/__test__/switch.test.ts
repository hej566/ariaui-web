import { afterEach, describe, expect, it, vi } from "vitest";
import {
  componentSpec,
  createSwitchElement,
  defineSwitchElements,
  getPartSpec,
  type ComponentPartName,
} from "../src";

type SwitchRoot = HTMLElement & {
  checked: boolean;
  defaultChecked: boolean;
  disabled: boolean;
  value: string;
};

function render(attributes = "") {
  defineSwitchElements();
  document.body.innerHTML = `
    <aria-switch ${attributes}>
      <aria-switch-track>
        <aria-switch-thumb></aria-switch-thumb>
      </aria-switch-track>
    </aria-switch>
  `;

  return {
    root: document.querySelector<SwitchRoot>("aria-switch")!,
    track: document.querySelector<HTMLElement>("aria-switch-track")!,
    thumb: document.querySelector<HTMLElement>("aria-switch-thumb")!,
    input: document.querySelector<HTMLInputElement>("input[data-switch-input]")!,
  };
}

describe("@ariaui-web/switch", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("publishes the separated native parts and helpers", () => {
    expect(componentSpec.packageName).toBe("@ariaui-web/switch");
    expect(componentSpec.parts.map(({ name, tagName, defaultRole }) => ({ name, tagName, defaultRole }))).toEqual([
      { name: "Root", tagName: "aria-switch", defaultRole: null },
      { name: "Thumb", tagName: "aria-switch-thumb", defaultRole: null },
      { name: "Track", tagName: "aria-switch-track", defaultRole: "switch" },
    ]);

    for (const part of componentSpec.parts) {
      expect(getPartSpec(part.name)).toBe(part);
      expect(createSwitchElement(part.name).localName).toBe(part.tagName);
    }
    expect(() => getPartSpec("Missing" as ComponentPartName)).toThrow("Unknown @ariaui-web/switch part");

    defineSwitchElements();
    defineSwitchElements();
    expect(customElements.get("aria-switch")).toBeTruthy();
    expect(customElements.get("aria-switch-track")).toBeTruthy();
    expect(customElements.get("aria-switch-thumb")).toBeTruthy();
  });

  it("exposes the unchecked state on Track and Thumb", () => {
    const { root, track, thumb, input } = render();

    expect(root.getAttribute("data-part")).toBe("Root");
    expect(root.hasAttribute("role")).toBe(false);
    expect(track).toMatchObject({ tabIndex: 0 });
    expect(track.getAttribute("role")).toBe("switch");
    expect(track.getAttribute("aria-checked")).toBe("false");
    expect(track.hasAttribute("data-state")).toBe(false);
    expect(thumb.getAttribute("data-state")).toBe("unchecked");
    expect(input).toMatchObject({ type: "checkbox", checked: false, tabIndex: -1 });
    expect(input.hidden).toBe(true);
  });

  it("uses default-checked as the initial uncontrolled value", () => {
    const { root, track, thumb, input } = render("default-checked");

    expect(root.checked).toBe(true);
    expect(track.getAttribute("aria-checked")).toBe("true");
    expect(thumb.getAttribute("data-state")).toBe("checked");
    expect(input.checked).toBe(true);
  });

  it("preserves an uncontrolled value when Root reconnects", () => {
    const { root, track } = render("default-checked");
    track.click();
    expect(root.checked).toBe(false);

    root.remove();
    document.body.append(root);

    expect(root.checked).toBe(false);
  });

  it("toggles through the hidden checkbox and emits checkedchange", () => {
    const { root, track, thumb, input } = render();
    const listener = vi.fn();
    root.addEventListener("checkedchange", listener);

    track.click();
    expect(root.checked).toBe(true);
    expect(input.checked).toBe(true);
    expect(track.getAttribute("aria-checked")).toBe("true");
    expect(thumb.getAttribute("data-state")).toBe("checked");
    expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { checked: true } }));

    track.click();
    expect(root.checked).toBe(false);
    expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { checked: false } }));
  });

  it("toggles with Space, prevents scrolling, and ignores Enter", () => {
    const { root, track } = render();
    const space = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });

    track.dispatchEvent(space);
    expect(space.defaultPrevented).toBe(true);
    expect(root.checked).toBe(true);

    track.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(root.checked).toBe(true);
  });

  it("blocks interaction and reflects disabled state", () => {
    const { root, track, thumb, input } = render("disabled");

    expect(track.getAttribute("aria-disabled")).toBe("true");
    expect(track.tabIndex).toBe(-1);
    expect(thumb.hasAttribute("data-disabled")).toBe(true);
    expect(input.disabled).toBe(true);
    track.click();
    track.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }));
    expect(root.checked).toBe(false);
  });

  it("allows Track to override Root's enabled state", () => {
    const { root, track, thumb } = render();
    track.setAttribute("disabled", "");

    expect(track.getAttribute("aria-disabled")).toBe("true");
    expect(track.tabIndex).toBe(-1);
    expect(thumb.hasAttribute("data-disabled")).toBe(false);
    track.click();
    expect(root.checked).toBe(false);

    track.removeAttribute("disabled");
    track.click();
    expect(root.checked).toBe(true);
  });

  it("synchronizes authored checked changes to every part", () => {
    const { root, track, thumb, input } = render();

    root.checked = true;
    expect(track.getAttribute("aria-checked")).toBe("true");
    expect(thumb.getAttribute("data-state")).toBe("checked");
    expect(input.checked).toBe(true);

    root.removeAttribute("checked");
    expect(track.getAttribute("aria-checked")).toBe("false");
    expect(thumb.getAttribute("data-state")).toBe("unchecked");
    expect(input.checked).toBe(false);
  });

  it("integrates with forms through a checkbox input", () => {
    defineSwitchElements();
    document.body.innerHTML = `
      <form>
        <aria-switch id="remember" name="remember" value="yes" required checked>
          <aria-switch-track><aria-switch-thumb></aria-switch-thumb></aria-switch-track>
        </aria-switch>
      </form>
    `;
    const root = document.querySelector<SwitchRoot>("aria-switch")!;
    const form = document.querySelector<HTMLFormElement>("form")!;
    const input = root.querySelector<HTMLInputElement>("input[data-switch-input]")!;

    expect(input).toMatchObject({ id: "remember", name: "remember", value: "yes", required: true, checked: true });
    expect(root.hasAttribute("id")).toBe(false);
    expect(new FormData(form).get("remember")).toBe("yes");

    root.checked = false;
    expect(new FormData(form).has("remember")).toBe(false);
  });

  it("can be activated by a label associated with the hidden input", () => {
    const { root } = render('id="remember"');
    const label = document.createElement("label");
    label.htmlFor = "remember";
    label.textContent = "Remember me";
    document.body.append(label);

    label.click();
    expect(root.checked).toBe(true);
  });

  it("forwards Thumb state to its child for native composition", () => {
    defineSwitchElements();
    document.body.innerHTML = `
      <aria-switch checked disabled>
        <aria-switch-track>
          <aria-switch-thumb native-composition><span class="thumb"></span></aria-switch-thumb>
        </aria-switch-track>
      </aria-switch>
    `;
    const child = document.querySelector<HTMLElement>("aria-switch-thumb > span")!;

    expect(child.className).toBe("thumb");
    expect(child.getAttribute("data-state")).toBe("checked");
    expect(child.hasAttribute("data-disabled")).toBe(true);
  });

  it("resumes observing native composition after Root reconnects", async () => {
    const { root, thumb } = render("checked");
    thumb.setAttribute("native-composition", "");
    root.remove();
    document.body.append(root);

    const child = document.createElement("span");
    thumb.append(child);
    await new Promise((resolve) => setTimeout(resolve));

    expect(child.getAttribute("data-state")).toBe("checked");
  });

  it("keeps nested switches independent", () => {
    defineSwitchElements();
    document.body.innerHTML = `
      <aria-switch>
        <aria-switch-track><aria-switch-thumb></aria-switch-thumb></aria-switch-track>
        <aria-switch checked>
          <aria-switch-track><aria-switch-thumb></aria-switch-thumb></aria-switch-track>
        </aria-switch>
      </aria-switch>
    `;
    const roots = document.querySelectorAll<SwitchRoot>("aria-switch");
    const tracks = document.querySelectorAll<HTMLElement>("aria-switch-track");

    tracks[0]!.click();
    expect(roots[0]!.checked).toBe(true);
    expect(roots[1]!.checked).toBe(true);
    tracks[1]!.click();
    expect(roots[0]!.checked).toBe(true);
    expect(roots[1]!.checked).toBe(false);
  });

  it("rejects Track and Thumb outside Root", () => {
    defineSwitchElements();
    const Track = customElements.get("aria-switch-track")!;
    const Thumb = customElements.get("aria-switch-thumb")!;
    const track = new Track() as HTMLElement & { connectedCallback(): void };
    const thumb = new Thumb() as HTMLElement & { connectedCallback(): void };

    expect(() => track.connectedCallback()).toThrow("Switch components must be used within Root");
    expect(() => thumb.connectedCallback()).toThrow("Switch components must be used within Root");
  });
});
