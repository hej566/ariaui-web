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

describe("@ariaui-web/input readme", () => {
  it("keeps the generated readme tied to the native custom element contract", () => {
    const markdown = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "readme.md"), "utf8");

    expect(markdown).toContain("@ariaui-web/input");
    expect(markdown).toContain("Native Web Component Contract");
    expect(markdown).toContain("Learned Native Requirements");
    expect(markdown).toContain("Web Component Test Requirements");
      expect(markdown).toContain("Input Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/input/__test__/input.test.tsx");
    expect(markdown).toContain("- Source test cases: 8");
    expect(markdown).toContain("Root renders a real native `<input>`");
    expect(markdown).toContain("Root composes native `input` events with `valuechange` events");
    expect(markdown).toContain("legacy `isDisabled` and `isRequired` attributes are filtered");
    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 8,
      learningSources: [
        "../ariaui/packages/input/__test__/input.test.tsx",
      ],
    });
    expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
      "Root renders a real native `<input>` owned by the browser-native custom element host",
      "Root composes native `input` events with `valuechange` events that expose the next string value",
      "docs examples include basic-controlled, password, with-button, and file-native examples with source-equivalent labels and classes",
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


  it("keeps the docs page aligned with the source Input examples", () => {
    const docsPage = readFileSync(join(process.cwd(), "web", "doc", "docs", "components", componentSpec.slug + ".md"), "utf8");

    expect(docsPage).toContain("## Features");
    expect(docsPage).toContain("## Installation");
    expect(docsPage).toContain("## Examples");
    expect(docsPage).toContain("### Basic controlled");
    expect(docsPage).toContain("### Password");
    expect(docsPage).toContain("### With button");
    expect(docsPage).toContain("### File (native)");
    expect(docsPage).toContain("## Anatomy");
    expect(docsPage).toContain("## API Reference");
    expect(docsPage).toContain("## Keyboard");
    expect(docsPage).toContain("## Accessibility");
    expect(docsPage).toContain("<aria-input");
    expect(docsPage).toContain("<aria-button");
    expect(docsPage).toContain("<input type=\"file\"");
    expect(docsPage).toContain("placeholder=\"Email\"");
    expect(docsPage).toContain("type=\"password\"");
    expect(docsPage).toContain("password123");
    expect(docsPage).toContain("Choose file");
    expect(docsPage).toContain("No file chosen");
    expect(docsPage).toContain("flex h-9 w-full max-w-md rounded-md border border-input bg-background px-3 py-1 text-sm");
    expect(docsPage).not.toContain("data-example-part=\"Root\">Root</aria-input>");
  });


  it("keeps native input behavior in package-local modules", () => {
    const elementSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", componentSpec.slug + "-element.ts"), "utf8");
    const domSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "input-dom.ts"), "utf8");
    const syncSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "input-sync.ts"), "utf8");
    const webComponentSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "input-web-component.ts"), "utf8");
    const partSpecSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "part-spec.ts"), "utf8");
    const rootSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Root.ts"), "utf8");
    const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

    expect(elementSource).toContain("extends AriaWebElement");
    expect(elementSource).toContain('packageSlug = "' + componentSpec.slug + '"');
    expect(elementSource).not.toContain("WebComponentPartSpec");
    expect(elementSource).not.toContain("createInputWebComponent");
    expect(domSource).toContain("inputForwardedAttributes");
    expect(domSource).toContain("ownedInput");
    expect(syncSource).toContain("ensureInputControl");
    expect(syncSource).toContain("syncInputPart");
    expect(syncSource).toContain("valuechange");
    expect(syncSource).not.toContain("extends AriaWebElement");
    expect(webComponentSource).toContain("WebComponentPartSpec");
    expect(webComponentSource).toContain("inputPartConstructors");
    expect(partSpecSource).toContain("getInputPartSpec");
    expect(rootSource).toContain("extends InputElement");
    expect(rootSource).toContain("getInputPartSpec");
    expect(utilsElementSource).not.toContain("syncInputPart");
    expect(utilsElementSource).not.toContain("ensureInputControl");
    expect(utilsElementSource).not.toContain("aria-input");

    for (const part of componentSpec.parts) {
      const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
      expect(partSource).not.toContain("createAriaWebComponent");
      expect(partSource).not.toContain("createInputWebComponent");
      expect(partSource).toContain("extends InputElement");
    }
  });

});
