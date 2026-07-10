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

describe("@ariaui-web/kbd readme", () => {
  it("keeps the generated readme tied to the native custom element contract", () => {
    const markdown = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "readme.md"), "utf8");

    expect(markdown).toContain("@ariaui-web/kbd");
    expect(markdown).toContain("Native Web Component Contract");
    expect(markdown).toContain("Learned Native Requirements");
    expect(markdown).toContain("Web Component Test Requirements");
      expect(markdown).toContain("Kbd Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/kbd/__test__/kbd.test.tsx");
    expect(markdown).toContain("- Source test cases: 10");
    expect(markdown).toContain("Root display semantics with no default role, focusability, ARIA state, or state data attributes");
    expect(markdown).toContain("Group remains a neutral shortcut grouping host with no default role");
    expect(markdown).toContain("native-composition child hosts as the browser-native adaptation of source slot composition");
    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 10,
      learningSources: [
        "../ariaui/packages/kbd/__test__/kbd.test.tsx",
      ],
    });
    expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
      "Root keeps keyboard-key display semantics with no default role, focusability, ARIA state, or reflected state data attributes",
      "Group remains a neutral shortcut grouping host with no default role while preserving consumer aria-label attributes",
      "docs examples include shortcut-group and inline variants with source-equivalent keycap, group, plus, and inline text classes",
    ]));
    expect(componentSpec.parts.find((part) => part.name === "Root")?.defaultRole).toBeNull();
    expect(componentSpec.parts.find((part) => part.name === "Group")?.defaultRole).toBeNull();
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


  it("keeps the docs page aligned with the source Kbd examples", () => {
    const docsPage = readFileSync(join(process.cwd(), "web", "doc", "docs", "components", componentSpec.slug + ".md"), "utf8");

    expect(docsPage).toContain("# Kbd");
    expect(docsPage).toContain("A keyboard input display primitive for shortcuts and key labels.");
    expect(docsPage).toContain("## Features");
    expect(docsPage).toContain("## Installation");
    expect(docsPage).toContain("## Examples");
    expect(docsPage).toContain("### Shortcut group");
    expect(docsPage).toContain("### Inline");
    expect(docsPage).toContain("## Anatomy");
    expect(docsPage).toContain("## API Reference");
    expect(docsPage).toContain("## Accessibility");
    expect(docsPage).not.toContain("## Keyboard");
    expect(docsPage).toContain("<aria-kbd");
    expect(docsPage).toContain("<aria-kbd-group");
    expect(docsPage).toContain('aria-label="Command Shift P"');
    expect(docsPage).toContain('aria-label="Control B"');
    expect(docsPage).toContain('aria-label="Command K"');
    expect(docsPage).toContain('aria-label="Escape"');
    expect(docsPage).toContain("⌘");
    expect(docsPage).toContain("⇧");
    expect(docsPage).toContain("Ctrl");
    expect(docsPage).toContain("Esc");
    expect(docsPage).toContain("inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium leading-none text-muted-foreground shadow-xs");
    expect(docsPage).not.toContain("data-example-part=\"Root\">Root</aria-kbd>");
  });


  it("keeps native kbd behavior in package-local modules", () => {
    const elementSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", componentSpec.slug + "-element.ts"), "utf8");
    const webComponentSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "kbd-web-component.ts"), "utf8");
    const partSpecSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "part-spec.ts"), "utf8");
    const rootSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Root.ts"), "utf8");
    const groupSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Group.ts"), "utf8");
    const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

    expect(elementSource).toContain("extends AriaWebElement");
    expect(elementSource).toContain('packageSlug = "' + componentSpec.slug + '"');
    expect(elementSource).toContain("removeKbdStateReflection");
    expect(elementSource).toContain("syncKbdNativeComposition");
    expect(elementSource).not.toContain("WebComponentPartSpec");
    expect(elementSource).not.toContain("createKbdWebComponent");
    expect(webComponentSource).toContain("WebComponentPartSpec");
    expect(webComponentSource).toContain("kbdPartConstructors");
    expect(partSpecSource).toContain("getKbdPartSpec");
    expect(rootSource).toContain("extends KbdElement");
    expect(groupSource).toContain("extends KbdElement");
    expect(utilsElementSource).not.toContain("syncKbdNativeComposition");

    for (const part of componentSpec.parts) {
      const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
      expect(partSource).not.toContain("createAriaWebComponent");
      expect(partSource).not.toContain("createKbdWebComponent");
      expect(partSource).toContain("extends KbdElement");
    }
  });

});
