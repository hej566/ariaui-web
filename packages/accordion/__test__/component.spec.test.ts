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

describe("@ariaui-web/accordion readme", () => {
  it("keeps the generated readme tied to the native custom element contract", () => {
    const markdown = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "readme.md"), "utf8");

    expect(markdown).toContain("@ariaui-web/accordion");
    expect(markdown).toContain("Native Web Component Contract");
    expect(markdown).toContain("Learned Native Requirements");
    expect(markdown).toContain("Web Component Test Requirements");
      expect(markdown).toContain("Accordion Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/accordion/__test__/accordion.test.tsx");
    expect(markdown).toContain("../ariaui/packages/accordion/__test__/accordion-aliases.test.tsx");
    expect(markdown).toContain("- Source test cases: 64");
    expect(markdown).toContain("controlled-style `value` and `valuechange` behavior");
    expect(markdown).toContain("default-open and force-mounted SSR-like serialized markup");
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


  it("keeps native element behavior in package-local modules", () => {
    const elementSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", componentSpec.slug + "-element.ts"), "utf8");
    const packageSlug = componentSpec.slug as string;
    const webComponentSource = packageSlug === "accordion"
      ? readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", componentSpec.slug + "-web-component.ts"), "utf8")
      : "";

    expect(elementSource).toContain("extends AriaWebElement");
    expect(elementSource).toContain('packageSlug = "' + componentSpec.slug + '"');
    if (packageSlug === "accordion") {
      expect(webComponentSource).toContain("WebComponentPartSpec");
    } else {
      expect(elementSource).toContain("WebComponentPartSpec");
    }

    for (const part of componentSpec.parts) {
      const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
      expect(partSource).not.toContain("createAriaWebComponent");
    }

    if (packageSlug === "accordion") {
      const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");
      const domSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "accordion-dom.ts"), "utf8");
      const valuesSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "accordion-values.ts"), "utf8");
      const syncSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "accordion-sync.ts"), "utf8");
      const actionsSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "accordion-actions.ts"), "utf8");
      const rootSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Root.ts"), "utf8");
      const triggerSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Trigger.ts"), "utf8");
      const buttonSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Button.ts"), "utf8");

      expect(elementSource).not.toContain("syncAccordionTreeFromRoot");
      expect(elementSource).not.toContain("toggleAccordionItem");
      expect(elementSource).not.toContain("handleCompositeRovingFocus");
      expect(domSource).toContain("accordionRoot");
      expect(domSource).toContain("accordionTriggers");
      expect(domSource).not.toContain("accordionRootValues");
      expect(valuesSource).toContain("accordionValuesFromAttribute");
      expect(valuesSource).toContain("writeAccordionRootValue");
      expect(valuesSource).not.toContain("querySelectorAll");
      expect(syncSource).toContain("syncAccordionTreeFromRoot");
      expect(syncSource).toContain("syncAccordionItem");
      expect(syncSource).not.toContain("toggleAccordionItem");
      expect(actionsSource).toContain("toggleAccordionItem");
      expect(actionsSource).toContain("nextAccordionOpenState");
      expect(actionsSource).not.toContain("syncAccordionItem");
      expect(rootSource).toContain('from "../accordion-sync"');
      expect(triggerSource).toContain("handleCompositeRovingFocus");
      expect(triggerSource).toContain("toggleControlledElement");
      expect(triggerSource).toContain('from "../accordion-dom"');
      expect(triggerSource).toContain('from "../accordion-actions"');
      expect(buttonSource).toContain("extends AccordionTriggerElement");
      expect(utilsElementSource).not.toContain("syncAccordionTreeFromRoot");
      expect(utilsElementSource).not.toContain("toggleAccordionItem");
      expect(utilsElementSource).not.toContain("aria-accordion");
      for (const part of componentSpec.parts) {
        const partName = part.name as string;
        const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
        expect(partSource).not.toContain("createAccordionWebComponent");
        if (partName === "Button") {
          expect(partSource).toContain("extends AccordionTriggerElement");
        } else if (partName === "Panel") {
          expect(partSource).toContain("extends AccordionContentElement");
        } else {
          expect(partSource).toContain("extends AccordionElement");
        }
      }
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
