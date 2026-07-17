import { defineGridElements } from "@ariaui-web/grid";
import { afterEach, describe, expect, it } from "vitest";
import { installGridExamples } from "../docs/.vitepress/theme/grid-examples";

function gridMarkup(variant: "uncontrolled" | "controlled", valueAttribute: string) {
  return `
    <div class="ariaui-web-preview" data-component="grid" data-example-variant="${variant}">
      <aria-grid aria-label="Team members" ${valueAttribute}>
        <aria-grid-body>
          <aria-grid-row>
            <aria-grid-cell value="john:name">John Doe</aria-grid-cell>
            <aria-grid-cell value="jane:role">Member</aria-grid-cell>
          </aria-grid-row>
        </aria-grid-body>
      </aria-grid>
      <div data-grid-selected-values></div>
    </div>
  `;
}

describe("grid docs examples", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("keeps summaries synchronized when installation happens before VitePress mounts the examples", async () => {
    defineGridElements();
    installGridExamples();
    document.body.innerHTML = [
      gridMarkup("uncontrolled", 'default-value="john:name"'),
      gridMarkup("controlled", 'value="john:name"'),
    ].join("");
    await Promise.resolve();

    const previews = Array.from(document.querySelectorAll<HTMLElement>("[data-component='grid']"));
    const uncontrolledRoot = previews[0]!.querySelector<HTMLElement>("aria-grid")!;
    const controlledRoot = previews[1]!.querySelector<HTMLElement>("aria-grid")!;
    const uncontrolledSummary = previews[0]!.querySelector<HTMLElement>("[data-grid-selected-values]")!;
    const controlledSummary = previews[1]!.querySelector<HTMLElement>("[data-grid-selected-values]")!;

    expect(uncontrolledSummary.textContent).toContain("john:name");
    expect(controlledSummary.textContent).toContain("john:name");

    uncontrolledRoot.querySelector<HTMLElement>("aria-grid-cell[value='jane:role']")!.click();
    controlledRoot.querySelector<HTMLElement>("aria-grid-cell[value='jane:role']")!.click();

    expect(uncontrolledRoot.getAttribute("value")).toBe("jane:role");
    expect(controlledRoot.getAttribute("value")).toBe("jane:role");
    expect(uncontrolledSummary.textContent).toContain("jane:role");
    expect(uncontrolledSummary.textContent).not.toContain("john:name");
    expect(controlledSummary.textContent).toContain("jane:role");
    expect(controlledSummary.textContent).not.toContain("john:name");
  });
});
