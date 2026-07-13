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

describe("@ariaui-web/card readme", () => {
  it("keeps the generated readme tied to the native custom element contract", () => {
    const markdown = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "readme.md"), "utf8");

    expect(markdown).toContain("@ariaui-web/card");
    expect(markdown).toContain("Native Web Component Contract");
    expect(markdown).toContain("Learned Native Requirements");
    expect(markdown).toContain("Web Component Test Requirements");
      expect(markdown).toContain("Card Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/card/__test__/card.test.tsx");
    expect(markdown).toContain("- Source test cases: 5");
    expect(markdown).toContain("Root, Header, Content, and Footer stay neutral structural hosts");
    expect(markdown).toContain("Title exposes source-equivalent h3 heading semantics");
    expect(markdown).toContain("docs examples include account-form, basic layout, login, meeting-notes, and with-image variants");
    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 5,
      learningSources: [
        "../ariaui/packages/card/__test__/card.test.tsx",
        "../ariaui/web/doc/src/app/docs/components/card/page.md",
        "../ariaui/web/doc/src/markdoc/partials/card/examples.md",
      ],
    });
    expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
      "Root, Header, Content, and Footer stay neutral structural hosts with no default role, focusability, ARIA state, or reflected state data attributes",
      "Title exposes source-equivalent h3 heading semantics through role=\"heading\" and aria-level=\"3\" on the native custom element host",
      "docs examples include account-form, basic layout, login, meeting-notes, and with-image variants with source-equivalent card classes",
    ]));
    expect(componentSpec.parts.find((part) => part.name === "Root")?.defaultRole).toBeNull();
    expect(componentSpec.parts.find((part) => part.name === "Header")?.defaultRole).toBeNull();
    expect(componentSpec.parts.find((part) => part.name === "Content")?.defaultRole).toBeNull();
    expect(componentSpec.parts.find((part) => part.name === "Description")?.defaultRole).toBeNull();
    expect(componentSpec.parts.find((part) => part.name === "Footer")?.defaultRole).toBeNull();
    expect(componentSpec.parts.find((part) => part.name === "Title")?.defaultRole).toBe("heading");
    expect(componentSpec.parts.find((part) => part.name === "Title")?.defaultAttributes).toEqual({ "aria-level": "3" });
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


  it("keeps the docs page aligned with the source Card examples", () => {
    const docsPage = readFileSync(join(process.cwd(), "web", "doc", "docs", "components", componentSpec.slug + ".md"), "utf8");

    expect(docsPage).toContain("# Card");
    expect(docsPage).toContain("A composable content container with Header, Title, Description, Content, and Footer parts.");
    expect(docsPage).toContain("## Features");
    expect(docsPage).toContain("## Installation");
    expect(docsPage).toContain("## Examples");
    expect(docsPage).toContain("### Account form");
    expect(docsPage).toContain("### Basic layout");
    expect(docsPage).toContain("### Login");
    expect(docsPage).toContain("### Meeting notes");
    expect(docsPage).toContain("### With image area");
    expect(docsPage).toContain("## Anatomy");
    expect(docsPage).toContain("## API Reference");
    expect(docsPage).toContain("## Accessibility");
    expect(docsPage).not.toContain("## Keyboard");
    expect(docsPage).toContain("<aria-card");
    expect(docsPage).toContain("<aria-card-header");
    expect(docsPage).toContain("<aria-card-title");
    expect(docsPage).toContain("<aria-card-description");
    expect(docsPage).toContain("<aria-card-content");
    expect(docsPage).toContain("<aria-card-footer");
    expect(docsPage).toContain("Create an account");
    expect(docsPage).toContain("Title Text");
    expect(docsPage).toContain("Login to your account");
    expect(docsPage).toContain("Meeting Notes");
    expect(docsPage).toContain("Is this an image?");
    expect(docsPage).toContain("w-[350px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm");
    expect(docsPage).not.toContain("data-example-part=\"Root\">Root</aria-card>");
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
