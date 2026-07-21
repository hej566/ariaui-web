import { defineRadioElements } from "@ariaui-web/radio";
import { afterEach, describe, expect, it } from "vitest";
import { installRadioExamples } from "../docs/.vitepress/theme/radio-examples";

afterEach(() => {
  document.body.replaceChildren();
});

describe("Radio live examples", () => {
  it("writes controlled value changes back to the example root", () => {
    defineRadioElements();
    document.body.innerHTML = `
      <div class="ariaui-web-preview" data-component="radio" data-example-variant="controlled">
        <aria-radio value="comfortable" aria-label="Density">
          <aria-radio-item value="default"></aria-radio-item>
          <aria-radio-item value="comfortable"></aria-radio-item>
          <aria-radio-item value="compact"></aria-radio-item>
        </aria-radio>
      </div>
    `;
    installRadioExamples(document);

    const root = document.querySelector<HTMLElement>("aria-radio")!;
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("aria-radio-item"),
    );
    items[2]!.click();

    expect(root.getAttribute("value")).toBe("compact");
    expect(items.map((item) => item.getAttribute("aria-checked"))).toEqual([
      "false",
      "false",
      "true",
    ]);
    expect(items.map((item) => item.getAttribute("tabindex"))).toEqual([
      "-1",
      "-1",
      "0",
    ]);
  });
});
