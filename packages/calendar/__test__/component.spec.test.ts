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

describe("@ariaui-web/calendar readme", () => {
  it("keeps the generated readme tied to the native custom element contract", () => {
    const markdown = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "readme.md"), "utf8");

    expect(markdown).toContain("@ariaui-web/calendar");
    expect(markdown).toContain("Native Web Component Contract");
    expect(markdown).toContain("Learned Native Requirements");
    expect(markdown).toContain("Web Component Test Requirements");
      expect(markdown).toContain("Calendar Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/calendar/__test__/calendar.test.tsx");
    expect(markdown).toContain("../ariaui/web/doc/src/app/docs/components/calendar/page.md");
    expect(markdown).toContain("- Source test cases: 28");
    expect(markdown).toContain("six-week grid-backed month view");
    expect(markdown).toContain("MonthSelect and YearSelect update the visible month");
    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 28,
      learningSources: [
        "../ariaui/packages/calendar/__test__/calendar.test.tsx",
        "../ariaui/web/doc/src/app/docs/components/calendar/page.md",
        "../ariaui/web/doc/src/markdoc/partials/calendar/examples.md",
      ],
    });
    expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
      "Root owns single, range, and dual-range date selection state with default dates, selected dates, visible month, valuechange, and visiblemonthchange behavior",
      "Body renders a six-week grid-backed month view with weekday headers, outside-month spillover days, and dual-range consecutive panes",
      "docs examples include Single, Range, Manual Grid, Dual Range, and Month/Year Selector variants with source-equivalent calendar page structure",
    ]));
    expect(componentSpec.parts.map((part) => part.name)).toEqual([
      "Root",
      "Header",
      "HeaderPrevious",
      "HeaderMonth",
      "HeaderYear",
      "HeaderNext",
      "Body",
      "Head",
      "Row",
      "DayHeader",
      "Rows",
      "Cell",
      "MonthSelect",
      "YearSelect",
    ]);
    expect(componentSpec.parts.find((part) => part.name === "Body")?.defaultRole).toBe("grid");
    expect(componentSpec.parts.find((part) => part.name === "DayHeader")?.defaultRole).toBe("columnheader");
    expect(componentSpec.parts.find((part) => part.name === "Cell")?.defaultRole).toBe("gridcell");
    expect(componentSpec.parts.find((part) => part.name === "Row")?.defaultAttributes).not.toHaveProperty("aria-selected");
    expect(componentSpec.requirementAttributes).toEqual(expect.arrayContaining([
      "aria-disabled",
      "aria-selected",
      "data-in-range",
      "data-outside-month",
      "data-range-end",
      "data-range-start",
      "data-slot",
      "data-today",
      "data-week-end",
      "data-week-start",
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


  it("keeps native calendar behavior in package-local modules", () => {
    const elementSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", componentSpec.slug + "-element.ts"), "utf8");
    const dateSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "calendar-date.ts"), "utf8");
    const domSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "calendar-dom.ts"), "utf8");
    const syncSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "calendar-sync.ts"), "utf8");
    const actionsSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "calendar-actions.ts"), "utf8");
    const webComponentSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "calendar-web-component.ts"), "utf8");
    const partSpecSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "part-spec.ts"), "utf8");
    const rootSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Root.ts"), "utf8");
    const cellSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Cell.ts"), "utf8");
    const monthSelectSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "MonthSelect.ts"), "utf8");
    const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

    expect(elementSource).toContain("extends AriaWebElement");
    expect(elementSource).toContain('packageSlug = "' + componentSpec.slug + '"');
    expect(elementSource).not.toContain("WebComponentPartSpec");
    expect(elementSource).not.toContain("createCalendarWebComponent");
    expect(dateSource).toContain("buildCalendarMonth");
    expect(dateSource).toContain("calendarRangeState");
    expect(domSource).toContain("calendarCells");
    expect(domSource).toContain("calendarPartSlot");
    expect(syncSource).toContain("syncCalendarTreeFromRoot");
    expect(syncSource).toContain("observeCalendarTree");
    expect(syncSource).toContain("renderDualCalendarBody");
    expect(syncSource).toContain("MutationObserver");
    expect(actionsSource).toContain("handleCalendarCellKeyDown");
    expect(actionsSource).toContain("selectCalendarDate");
    expect(webComponentSource).toContain("WebComponentPartSpec");
    expect(webComponentSource).toContain("calendarPartConstructors");
    expect(partSpecSource).toContain("getCalendarPartSpec");
    expect(rootSource).toContain("extends CalendarElement");
    expect(cellSource).toContain("extends CalendarElement");
    expect(monthSelectSource).toContain("extends CalendarElement");
    expect(utilsElementSource).not.toContain("syncCalendarTreeFromRoot");
    expect(utilsElementSource).not.toContain("aria-calendar");

    for (const part of componentSpec.parts) {
      const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
      expect(partSource).not.toContain("createAriaWebComponent");
      expect(partSource).not.toContain("createCalendarWebComponent");
      expect(partSource).toContain("extends CalendarElement");
    }
  });

});
