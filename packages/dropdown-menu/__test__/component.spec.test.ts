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

describe("@ariaui-web/dropdown-menu readme", () => {
  it("keeps the generated readme tied to the native custom element contract", () => {
    const markdown = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "readme.md"), "utf8");

    expect(markdown).toContain("@ariaui-web/dropdown-menu");
    expect(markdown).toContain("Native Web Component Contract");
    expect(markdown).toContain("Learned Native Requirements");
    expect(markdown).toContain("Web Component Test Requirements");
      expect(markdown).toContain("Dropdown Menu Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/dropdown-menu/__test__/dropdown-menu.test.tsx");
    expect(markdown).toContain("- Source test cases: 92");
    expect(markdown).toContain("Trigger, Content, and SubContent ARIA relationships");
    expect(markdown).toContain("active descendant keyboard navigation");
    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 92,
      learningSources: [
        "../ariaui/packages/dropdown-menu/__test__/dropdown-menu.test.tsx",
      ],
    });
    expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
      "Trigger, Content, and SubContent ARIA relationships stay synchronized across closed and open states",
      "Content and SubContent use `role=\"menu\"`, `tabindex=\"-1\"`, `data-dropdown-menu-content`, and `aria-activedescendant` for active-item tracking",
      "CheckboxItem and RadioItem expose source-equivalent `aria-checked` state and activation behavior",
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


  it("keeps the docs page aligned with the source Dropdown Menu examples", () => {
    const docsPage = readFileSync(join(process.cwd(), "web", "doc", "docs", "components", componentSpec.slug + ".md"), "utf8");

    expect(docsPage).toContain("## Features");
    expect(docsPage).toContain("## Examples");
    expect(docsPage).toContain("### Full menu");
    expect(docsPage).toContain("### With submenu");
    expect(docsPage).toContain("### With checkboxes");
    expect(docsPage).toContain("### With radio group");
    expect(docsPage).toContain("### Framer Motion");
    expect(docsPage).toContain("## Anatomy");
    expect(docsPage).toContain("## API Reference");
    expect(docsPage).toContain("## Keyboard");
    expect(docsPage).toContain("## Accessibility");
    expect(docsPage).toContain("Menu button pattern");
    expect(docsPage).toContain("<aria-dropdown-menu");
    expect(docsPage).toContain("<aria-dropdown-menu-sub-trigger");
    expect(docsPage).toContain("<aria-dropdown-menu-sub-content");
    expect(docsPage).toContain("Open Menu");
    expect(docsPage).toContain("My Account");
    expect(docsPage).toContain("m@example.com");
    expect(docsPage).toContain("Profile");
    expect(docsPage).toContain("Billing");
    expect(docsPage).toContain("Settings");
    expect(docsPage).toContain("Invite users");
    expect(docsPage).toContain("Status Bar");
    expect(docsPage).toContain("Panel Position");
    expect(docsPage).toContain("Log out");
    expect(docsPage).not.toContain("data-example-part=\"Root\">Root</aria-dropdown-menu>");
  });


  it("keeps native element behavior in package-local modules", () => {
    const elementSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", componentSpec.slug + "-element.ts"), "utf8");
    const domSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "dropdown-menu-dom.ts"), "utf8");
    const syncSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "dropdown-menu-sync.ts"), "utf8");
    const actionsSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "dropdown-menu-actions.ts"), "utf8");
    const webComponentSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "dropdown-menu-web-component.ts"), "utf8");
    const partSpecSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "part-spec.ts"), "utf8");
    const rootSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Root.ts"), "utf8");
    const subTriggerSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "SubTrigger.ts"), "utf8");
    const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

    expect(elementSource).toContain("extends AriaWebElement");
    expect(elementSource).toContain('packageSlug = "' + componentSpec.slug + '"');
    expect(elementSource).not.toContain("WebComponentPartSpec");
    expect(elementSource).not.toContain("createDropdownMenuWebComponent");
    expect(domSource).toContain("dropdownMenuRoot");
    expect(domSource).toContain("dropdownMenuItems");
    expect(syncSource).toContain("syncDropdownMenuTreeAround");
    expect(syncSource).toContain("syncDropdownMenuSub");
    expect(actionsSource).toContain("handleDropdownMenuKeyDown");
    expect(actionsSource).toContain("handleDropdownMenuClick");
    expect(webComponentSource).toContain("WebComponentPartSpec");
    expect(webComponentSource).toContain("dropdownMenuPartConstructors");
    expect(partSpecSource).toContain("getDropdownMenuPartSpec");
    expect(rootSource).toContain("extends DropdownMenuElement");
    expect(subTriggerSource).toContain("extends DropdownMenuElement");
    expect(utilsElementSource).not.toContain("syncDropdownMenuTreeAround");
    expect(utilsElementSource).not.toContain("aria-dropdown-menu");

    for (const part of componentSpec.parts) {
      const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
      expect(partSource).not.toContain("createAriaWebComponent");
      expect(partSource).not.toContain("createDropdownMenuWebComponent");
      expect(partSource).toContain("extends DropdownMenuElement");
    }
  });

});
