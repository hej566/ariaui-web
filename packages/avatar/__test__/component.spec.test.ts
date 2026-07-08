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

describe("@ariaui-web/avatar readme", () => {
  it("keeps the generated readme tied to the native custom element contract", () => {
    const markdown = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "readme.md"), "utf8");

    expect(markdown).toContain("@ariaui-web/avatar");
    expect(markdown).toContain("Native Web Component Contract");
    expect(markdown).toContain("Learned Native Requirements");
    expect(markdown).toContain("Web Component Test Requirements");
      expect(markdown).toContain("Avatar Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/avatar/__test__/avatar.test.tsx");
    expect(markdown).toContain("../ariaui/packages/avatar/__test__/avatar-examples.test.tsx");
    expect(markdown).toContain("- Source test cases: 36");
    expect(markdown).toContain("Root defaults to `role=\"img\"` and `aria-label=\"avatar\"` while fallback content is visible");
    expect(markdown).toContain("Image owns a real rendered `<img>`");
    expect(markdown).toContain("Group defaults to `role=\"group\"`");
    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 36,
      learningSources: [
        "../ariaui/packages/avatar/__test__/avatar.test.tsx",
        "../ariaui/packages/avatar/__test__/avatar-examples.test.tsx",
      ],
    });
    expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
      "Root defaults to `role=\"img\"` and `aria-label=\"avatar\"` while fallback content is visible",
      "Fallback renders while image status is not loaded and supports delayed rendering",
      "docs examples include with-image, initials-only, and overlapping group rows with `/avatar.png` media",
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


  it("keeps native element behavior in package-local modules", () => {
    const elementSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", componentSpec.slug + "-element.ts"), "utf8");
    const domSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "avatar-dom.ts"), "utf8");
    const syncSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "avatar-sync.ts"), "utf8");
    const webComponentSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "avatar-web-component.ts"), "utf8");
    const rootSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Root.ts"), "utf8");
    const imageSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Image.ts"), "utf8");
    const fallbackSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Fallback.ts"), "utf8");
    const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

    expect(elementSource).toContain("extends AriaWebElement");
    expect(elementSource).toContain('packageSlug = "' + componentSpec.slug + '"');
    expect(elementSource).not.toContain("WebComponentPartSpec");
    expect(elementSource).not.toContain("syncAvatarRoot()");
    expect(elementSource).not.toContain("createAvatarWebComponent");
    expect(domSource).toContain("avatarImageForwardAttributes");
    expect(domSource).toContain("nearestAvatarRoot");
    expect(domSource).not.toContain("MutationObserver");
    expect(syncSource).toContain("syncAvatarPart");
    expect(syncSource).toContain("syncAvatarRoot");
    expect(syncSource).toContain("syncAvatarFallback");
    expect(syncSource).toContain("syncAvatarImage");
    expect(syncSource).toContain("MutationObserver");
    expect(syncSource).not.toContain("extends AriaWebElement");
    expect(webComponentSource).toContain("WebComponentPartSpec");
    expect(webComponentSource).toContain("avatarPartConstructors");
    expect(rootSource).toContain("extends AvatarElement");
    expect(imageSource).toContain("extends AvatarElement");
    expect(fallbackSource).toContain("extends AvatarElement");
    expect(rootSource).toContain("getAvatarPartSpec");
    expect(utilsElementSource).not.toContain("syncAvatarRoot");
    expect(utilsElementSource).not.toContain("avatarImageForwardAttributes");
    expect(utilsElementSource).not.toContain("aria-avatar");

    for (const part of componentSpec.parts) {
      const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
      expect(partSource).not.toContain("createAriaWebComponent");
      expect(partSource).not.toContain("createAvatarWebComponent");
      expect(partSource).toContain("extends AvatarElement");
    }
  });

});
