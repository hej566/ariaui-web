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

describe("@ariaui-web/button readme", () => {
  it("keeps the generated readme tied to the native custom element contract", () => {
    const markdown = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "readme.md"), "utf8");

    expect(markdown).toContain("@ariaui-web/button");
    expect(markdown).toContain("Native Web Component Contract");
    expect(markdown).toContain("Learned Native Requirements");
    expect(markdown).toContain("Web Component Test Requirements");
      expect(markdown).toContain("Button Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/button/__test__/button.test.tsx");
    expect(markdown).toContain("../ariaui/packages/button/__test__/aria.test.tsx");
    expect(markdown).toContain("- Source test cases: 39");
    expect(markdown).toContain("default `type=\"button\"` and keyboard activation");
    expect(markdown).toContain("disabled link-mode buttons remove `href`");
    expect(markdown).toContain("docs examples include primary, secondary, destructive, outline, ghost, link, with-icon, loading, and sizes variants");
    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 39,
      learningSources: [
        "../ariaui/packages/button/__test__/button.test.tsx",
        "../ariaui/packages/button/__test__/aria.test.tsx",
      ],
    });
    expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
      "Root exposes source-equivalent button semantics on the browser-native custom element host, including default `type=\"button\"` and keyboard activation",
      "`as=\"a\"` and `href` provide the source native-composition link equivalent while disabled link-mode buttons remove `href` and expose disabled button semantics",
      "Item reflects `data-position=\"only\"`, `first`, `middle`, and `last` from DOM order, including nested items",
    ]));
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


  it("keeps the docs page aligned with the source Button examples", () => {
    const docsPage = readFileSync(join(process.cwd(), "web", "doc", "docs", "components", componentSpec.slug + ".md"), "utf8");

    expect(docsPage).toContain("## Features");
    expect(docsPage).toContain("## Installation");
    expect(docsPage).toContain("## Examples");
    expect(docsPage).toContain("### Primary");
    expect(docsPage).toContain("### Secondary");
    expect(docsPage).toContain("### Destructive");
    expect(docsPage).toContain("### Outline");
    expect(docsPage).toContain("### Ghost");
    expect(docsPage).toContain("### Link");
    expect(docsPage).toContain("### With icon");
    expect(docsPage).toContain("### Loading");
    expect(docsPage).toContain("### Sizes");
    expect(docsPage).toContain("## Anatomy");
    expect(docsPage).toContain("## API Reference");
    expect(docsPage).toContain("## Keyboard");
    expect(docsPage).toContain("## Accessibility");
    expect(docsPage).toContain("<aria-button");
    expect(docsPage).toContain("<aria-button-group");
    expect(docsPage).toContain("<aria-button-item");
    expect(docsPage).toContain("Button");
    expect(docsPage).toContain("Secondary");
    expect(docsPage).toContain("Destructive");
    expect(docsPage).toContain("Outline");
    expect(docsPage).toContain("Ghost");
    expect(docsPage).toContain("Link");
    expect(docsPage).toContain("Send");
    expect(docsPage).toContain("Learn more");
    expect(docsPage).toContain("Please wait");
    expect(docsPage).toContain("Small");
    expect(docsPage).toContain("Default");
    expect(docsPage).toContain("Large");
    expect(docsPage).toContain("M6 12 3.269");
    expect(docsPage).toContain("M17.25 8.25 21 12");
    expect(docsPage).toContain("M16.023 9.348");
    expect(docsPage).not.toContain("data-example-part=\"Root\">Root</aria-button>");
  });


  it("keeps native element behavior in package-local modules", () => {
    const elementSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", componentSpec.slug + "-element.ts"), "utf8");
    const domSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "button-dom.ts"), "utf8");
    const syncSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "button-sync.ts"), "utf8");
    const actionsSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "button-actions.ts"), "utf8");
    const webComponentSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "button-web-component.ts"), "utf8");
    const partSpecSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "part-spec.ts"), "utf8");
    const rootSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Root.ts"), "utf8");
    const itemSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Item.ts"), "utf8");
    const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

    expect(elementSource).toContain("extends AriaWebElement");
    expect(elementSource).toContain('packageSlug = "' + componentSpec.slug + '"');
    expect(elementSource).not.toContain("WebComponentPartSpec");
    expect(elementSource).not.toContain("createButtonWebComponent");
    expect(domSource).toContain("buttonIsLinkMode");
    expect(domSource).toContain("buttonGroupItems");
    expect(syncSource).toContain("syncButtonPart");
    expect(syncSource).toContain("syncButtonItemPositions");
    expect(syncSource).toContain("MutationObserver");
    expect(syncSource).not.toContain("extends AriaWebElement");
    expect(actionsSource).toContain("handleButtonClick");
    expect(actionsSource).toContain("handleButtonKeyDown");
    expect(actionsSource).not.toContain("syncButtonPart");
    expect(webComponentSource).toContain("WebComponentPartSpec");
    expect(webComponentSource).toContain("buttonPartConstructors");
    expect(partSpecSource).toContain("getButtonPartSpec");
    expect(rootSource).toContain("extends ButtonElement");
    expect(itemSource).toContain("extends ButtonElement");
    expect(utilsElementSource).not.toContain("syncButtonPart");
    expect(utilsElementSource).not.toContain("aria-button");

    for (const part of componentSpec.parts) {
      const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
      expect(partSource).not.toContain("createAriaWebComponent");
      expect(partSource).not.toContain("createButtonWebComponent");
      expect(partSource).toContain("extends ButtonElement");
    }
  });

});
