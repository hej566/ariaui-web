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

describe("@ariaui-web/command readme", () => {
  it("keeps the generated readme tied to the native custom element contract", () => {
    const markdown = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "readme.md"), "utf8");

    expect(markdown).toContain("@ariaui-web/command");
    expect(markdown).toContain("Native Web Component Contract");
    expect(markdown).toContain("Learned Native Requirements");
    expect(markdown).toContain("Web Component Test Requirements");
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

  it("declares command source-parity roles and native state attributes", () => {
    const parts = Object.fromEntries(componentSpec.parts.map((part) => [part.name, part]));

    expect(parts.Root?.defaultRole).toBeNull();
    expect(parts.Root?.defaultAttributes).toMatchObject({ tabindex: "-1" });
    expect(parts.Input?.defaultRole).toBe("combobox");
    expect(parts.Input?.defaultAttributes).toMatchObject({
      "aria-autocomplete": "list",
      "aria-expanded": "true",
      tabindex: "0",
    });
    expect(parts.Content?.defaultRole).toBe("listbox");
    expect(parts.Content?.defaultAttributes).toMatchObject({ tabindex: "-1" });
    expect(parts.Empty?.defaultRole).toBe("presentation");
    expect(parts.Loading?.defaultRole).toBe("progressbar");
    expect(parts.Option?.defaultRole).toBe("option");
    expect(parts.Separator?.defaultRole).toBe("separator");

    expect(componentSpec.requirementAttributes).toEqual(expect.arrayContaining([
      "aria-activedescendant",
      "aria-autocomplete",
      "aria-controls",
      "aria-expanded",
      "aria-selected",
      "data-disabled",
      "data-selected",
      "data-value",
      "default-search-value",
      "disable-pointer-selection",
      "force-mount",
      "search-value",
      "should-filter",
    ]));
  });

  it("documents source test parity for native command behavior", () => {
    const parity = (componentSpec as typeof componentSpec & {
      sourceTestParity?: {
        learningSources: string[];
        nativeRequirements: string[];
        sourceTestCases: number;
      };
    }).sourceTestParity;

    expect(parity).toMatchObject({
      sourceTestCases: 21,
      learningSources: [
        "../ariaui/packages/command/__test__/command.test.tsx",
        "../ariaui/packages/command/readme.md",
        "../ariaui/web/doc/src/components/command/CommandExample.tsx",
        "../ariaui/web/doc/src/markdoc/partials/command/examples.md",
      ],
    });
    expect(parity?.nativeRequirements).toEqual(expect.arrayContaining([
      "command root owns selected value, search value, active option, filtering, registration, and keyboard shortcuts",
      "command input exposes combobox semantics and syncs native search value",
      "command options filter by value and keywords and expose data-selected, data-disabled, and data-value",
      "docs page uses source-equivalent Features, Installation, Examples, Anatomy, API Reference, Keyboard Interactions, and Accessibility structure",
    ]));
  });


  it("keeps native element behavior in package-local modules", () => {
    const elementSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", componentSpec.slug + "-element.ts"), "utf8");

    expect(elementSource).toContain("extends AriaWebElement");
    expect(elementSource).toContain("WebComponentPartSpec");
    expect(elementSource).toContain('packageSlug = "' + componentSpec.slug + '"');

    for (const part of componentSpec.parts) {
      const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
      expect(partSource).toContain('from "../' + componentSpec.slug + '-element"');
      expect(partSource).not.toContain("createAriaWebComponent");
    }

    const packageSlug = componentSpec.slug as string;
    if (packageSlug === "accordion") {
      const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

      expect(elementSource).toContain("syncAccordionTreeFromRoot");
      expect(elementSource).toContain("handleCompositeRovingFocus");
      expect(utilsElementSource).not.toContain("syncAccordionTreeFromRoot");
      expect(utilsElementSource).not.toContain("toggleAccordionItem");
      expect(utilsElementSource).not.toContain("aria-accordion");
    }

    if (packageSlug === "alert") {
      const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

      expect(elementSource).toContain("syncAlertTreeFromRoot");
      expect(elementSource).toContain("requestAlertDismiss");
      expect(utilsElementSource).not.toContain("syncAlertTreeFromRoot");
      expect(utilsElementSource).not.toContain("requestAlertDismiss");
      expect(utilsElementSource).not.toContain("aria-alert");
    }

    if (packageSlug === "dialog") {
      const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

      expect(elementSource).toContain("syncDialogTreeFromRoot");
      expect(elementSource).toContain("requestDialogOpen");
      expect(elementSource).toContain("requestDialogClose");
      expect(utilsElementSource).not.toContain("syncDialogTreeFromRoot");
      expect(utilsElementSource).not.toContain("requestDialogOpen");
      expect(utilsElementSource).not.toContain("requestDialogClose");
      expect(utilsElementSource).not.toContain("aria-dialog");
    }

    if (packageSlug === "alert-dialog") {
      const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

      expect(elementSource).toContain("syncAlertDialogTreeFromRoot");
      expect(elementSource).toContain("requestAlertDialogOpen");
      expect(elementSource).toContain("requestAlertDialogClose");
      expect(utilsElementSource).not.toContain("syncAlertDialogTreeFromRoot");
      expect(utilsElementSource).not.toContain("requestAlertDialogOpen");
      expect(utilsElementSource).not.toContain("requestAlertDialogClose");
      expect(utilsElementSource).not.toContain("aria-alert-dialog");
    }
  });

});
