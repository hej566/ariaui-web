import { axe } from "jest-axe";
import { afterEach, describe, expect, it } from "vitest";
import { defineListboxElements } from "../src";

async function expectAccessible(markup: string) {
  defineListboxElements();
  const container = document.createElement("div");
  container.innerHTML = markup;
  document.body.replaceChildren(container);
  const result = await axe(container);
  expect(result.violations).toEqual([]);
}

afterEach(() => document.body.replaceChildren());

describe("@ariaui-web/listbox accessibility", () => {
  it("has no basic violations", () => expectAccessible(`
    <aria-listbox><aria-listbox-label>Choose a fruit</aria-listbox-label>
      <aria-listbox-content><aria-listbox-option value="apple">Apple</aria-listbox-option></aria-listbox-content>
    </aria-listbox>`));

  it("has no selected-option violations", () => expectAccessible(`
    <aria-listbox default-value="banana"><aria-listbox-label>Choose a fruit</aria-listbox-label>
      <aria-listbox-content><aria-listbox-option value="apple">Apple</aria-listbox-option><aria-listbox-option value="banana">Banana</aria-listbox-option></aria-listbox-content>
    </aria-listbox>`));

  it("has no disabled-option violations", () => expectAccessible(`
    <aria-listbox><aria-listbox-label>Choose a fruit</aria-listbox-label>
      <aria-listbox-content><aria-listbox-option value="banana" disabled>Banana unavailable</aria-listbox-option></aria-listbox-content>
    </aria-listbox>`));

  it("has no grouped-option violations", () => expectAccessible(`
    <aria-listbox><aria-listbox-label>Choose food</aria-listbox-label><aria-listbox-content>
      <aria-listbox-group><aria-listbox-group-label>Fruits</aria-listbox-group-label><aria-listbox-option value="apple">Apple</aria-listbox-option></aria-listbox-group>
      <aria-listbox-group><aria-listbox-group-label>Vegetables</aria-listbox-group-label><aria-listbox-option value="carrot">Carrot</aria-listbox-option></aria-listbox-group>
    </aria-listbox-content></aria-listbox>`));

  it("has no multiple-selection violations", () => expectAccessible(`
    <aria-listbox selection-mode="multiple" default-value="apple,banana"><aria-listbox-label>Choose fruits</aria-listbox-label>
      <aria-listbox-content><aria-listbox-option value="apple">Apple</aria-listbox-option><aria-listbox-option value="banana">Banana</aria-listbox-option></aria-listbox-content>
    </aria-listbox>`));
});
