import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { componentSpec } from "../src/component-spec";

function parsePartsTable(markdown: string) {
  const learnedSectionStart = markdown.indexOf("## Learned Native Requirements");
  const partsSection = markdown.slice(
    markdown.indexOf("## Parts"),
    learnedSectionStart === -1 ? markdown.indexOf("## Web Component Test Requirements") : learnedSectionStart,
  );
  const rows = partsSection
    .split("\n")
    .filter((line) => line.startsWith("| ") && !line.includes("---"))
    .slice(1);

  return rows.map((row) => {
    const codeMarker = String.fromCharCode(96);
    const cells = row
      .slice(2, -2)
      .split(" | ")
      .map((cell) => (cell.startsWith(codeMarker) && cell.endsWith(codeMarker) ? cell.slice(1, -1) : cell));
    const [name = "", tagName = "", role = "none"] = cells;

    return {
      name,
      tagName,
      defaultRole: role === "none" ? null : role,
    };
  });
}

describe("@ariaui-web/grid readme", () => {
  it("keeps the generated readme tied to the native custom element contract", () => {
    const markdown = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "readme.md"), "utf8");

    expect(markdown).toContain("@ariaui-web/grid");
    expect(markdown).toContain("Native Web Component Contract");
    expect(markdown).toContain("Learned Native Requirements");
    expect(markdown).toContain("Web Component Test Requirements");
      expect(markdown).toContain("Grid Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/grid/__test__/grid.test.tsx");
    expect(markdown).toContain("- Source test cases: 29");
    expect(markdown).toContain("coordinates descendant cells");
    expect(markdown).toContain("Shift+Space toggles the row");
    expect(markdown).toContain("controlled team-member grids");
    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 29,
      learningSources: [
        "../ariaui/packages/grid/__test__/grid.test.tsx",
      ],
    });
    expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
      "Root exposes `role=\"grid\"`, coordinates descendant cells, and manages roving tabindex state",
      "Head and Body remain structural hosts while Row exposes `role=\"row\"`, Header exposes `role=\"columnheader\"`, and Cell exposes `role=\"gridcell\"`",
      "docs examples include uncontrolled and controlled team-member grids with source-equivalent table, selected values panel, and grid styling classes",
    ]));
    expect(componentSpec.parts.find((part) => part.name === "Header")?.defaultRole).toBe("columnheader");
    expect(componentSpec.parts.find((part) => part.name === "Cell")?.defaultRole).toBe("gridcell");
    expect(componentSpec.parts.find((part) => part.name === "Row")?.defaultAttributes).not.toHaveProperty("aria-selected");
    expect(markdown).toContain("- Kind: " + String.fromCharCode(96) + componentSpec.kind + String.fromCharCode(96));
    expect(componentSpec.learnedRequirements.learningSource).toContain("../ariaui/packages/" + componentSpec.slug);
    expect(componentSpec.learnedRequirements.coverage.coveredSections).toBe(componentSpec.learnedRequirements.sections.length);
    expect(componentSpec.learnedRequirements.coverage.coveredSections).toBe(componentSpec.learnedRequirements.coverage.sourceSections);
    expect(componentSpec.learnedRequirements.coverage.requirements).toBeGreaterThanOrEqual(componentSpec.learnedRequirements.sections.length);
    expect(markdown).toContain("- Coverage: " + componentSpec.learnedRequirements.coverage.coveredSections + " of " + componentSpec.learnedRequirements.coverage.sourceSections + " documented sections are represented after native normalization.");
    expect(markdown).not.toContain("Source package:");
    expect(markdown).not.toContain("Source Package Contract");
    expect(markdown).not.toContain("@ariaui/");
    expect(markdown).not.toMatch(/\bReact\b/);
    expect(markdown).not.toContain("react-dom");
    expect(markdown).not.toContain("Client Component");
    expect(markdown).not.toMatch(/\basChild\b/);
    expect(componentSpec.description).not.toMatch(/\bReact\b/);

    for (const section of componentSpec.learnedRequirements.sections) {
      expect(markdown).toContain("### " + section.title);
      expect(section.requirements.length).toBeGreaterThan(0);
      expect(section.sourceHeadingLevel).toBeGreaterThanOrEqual(1);
      expect(section.sourceHeadingLevel).toBeLessThanOrEqual(6);

      for (const requirement of section.requirements) {
        expect(markdown).toContain(requirement);
      }
    }

    const tableParts = parsePartsTable(markdown);
    const specKind = componentSpec.kind as string;

    if (specKind === "utility") {
      expect(tableParts).toEqual([
        {
          name: "Utility",
          tagName: "none",
          defaultRole: null,
        },
      ]);
      return;
    }

    expect(tableParts).toHaveLength(componentSpec.parts.length);

    for (const part of componentSpec.parts as ReadonlyArray<{ name: string; tagName: string; defaultRole: string | null }>) {
      const tablePart = tableParts.find((candidate) => candidate.name === part.name);
      expect(tablePart).toEqual({
        name: part.name,
        tagName: part.tagName,
        defaultRole: part.defaultRole,
      });
      expect(markdown).toContain(part.name);
      expect(markdown).toContain(part.tagName);
    }
  });


  it("keeps the docs page aligned with the source Grid examples", () => {
    const docsPage = readFileSync(join(process.cwd(), "web", "doc", "docs", "components", componentSpec.slug + ".md"), "utf8");

    expect(docsPage).toContain("## Features");
    expect(docsPage).toContain("## Examples");
    expect(docsPage).toContain("### Uncontrolled");
    expect(docsPage).toContain("### Controlled");
    expect(docsPage).toContain("## Anatomy");
    expect(docsPage).toContain("## API Reference");
    expect(docsPage).toContain("## Keyboard");
    expect(docsPage).toContain("## Accessibility");
    expect(docsPage).toContain("WAI-ARIA Grid pattern");
    expect(docsPage).toContain("<aria-grid");
    expect(docsPage).toContain("<aria-grid-head");
    expect(docsPage).toContain("<aria-grid-header");
    expect(docsPage).toContain("<aria-grid-body");
    expect(docsPage).toContain("<aria-grid-row");
    expect(docsPage).toContain("<aria-grid-cell");
    expect(docsPage).toContain("Team members");
    expect(docsPage).toContain("Selected values");
    expect(docsPage).toContain("John Doe");
    expect(docsPage).toContain("Jane Smith");
    expect(docsPage).toContain("Bob Jones");
    expect(docsPage).toContain('default-value=\"jane:role\"');
    expect(docsPage).toContain('value=\"bob:status\"');
    expect(docsPage).not.toContain("data-example-part=\"Root\">Root</aria-grid>");
  });


  it("keeps native grid behavior in package-local modules", () => {
    const elementSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", componentSpec.slug + "-element.ts"), "utf8");
    const domSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "grid-dom.ts"), "utf8");
    const syncSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "grid-sync.ts"), "utf8");
    const actionsSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "grid-actions.ts"), "utf8");
    const webComponentSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "grid-web-component.ts"), "utf8");
    const partSpecSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "part-spec.ts"), "utf8");
    const rootSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Root.ts"), "utf8");
    const cellSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Cell.ts"), "utf8");
    const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

    expect(elementSource).toContain("extends AriaWebElement");
    expect(elementSource).toContain('packageSlug = "' + componentSpec.slug + '"');
    expect(elementSource).not.toContain("WebComponentPartSpec");
    expect(elementSource).not.toContain("createGridWebComponent");
    expect(domSource).toContain("gridCells");
    expect(domSource).toContain("gridCellValue");
    expect(syncSource).toContain("syncGridTreeFromRoot");
    expect(syncSource).toContain("observeGridTree");
    expect(syncSource).toContain("MutationObserver");
    expect(actionsSource).toContain("handleGridCellKeyDown");
    expect(actionsSource).toContain("selectGridCell");
    expect(webComponentSource).toContain("WebComponentPartSpec");
    expect(webComponentSource).toContain("gridPartConstructors");
    expect(partSpecSource).toContain("getGridPartSpec");
    expect(rootSource).toContain("extends GridElement");
    expect(cellSource).toContain("extends GridElement");
    expect(utilsElementSource).not.toContain("syncGridTreeFromRoot");
    expect(utilsElementSource).not.toContain("aria-grid");

    for (const part of componentSpec.parts) {
      const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
      expect(partSource).not.toContain("createAriaWebComponent");
      expect(partSource).not.toContain("createGridWebComponent");
      expect(partSource).toContain("extends GridElement");
    }
  });

});
