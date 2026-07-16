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

describe("@ariaui-web/progress readme", () => {
  it("keeps the generated readme tied to the native custom element contract", () => {
    const markdown = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "readme.md"), "utf8");

    expect(markdown).toContain("@ariaui-web/progress");
    expect(markdown).toContain("Native Web Component Contract");
    expect(markdown).toContain("Learned Native Requirements");
    expect(markdown).toContain("Web Component Test Requirements");
    expect(markdown).toContain("Progress Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/progress/__test__/progress.test.tsx");
    expect(markdown).toContain("- Source test cases: 24");
    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 24,
      learningSources: [
        "../ariaui/packages/progress/__test__/progress.test.tsx",
        "../ariaui/web/doc/src/app/docs/components/progress/page.md",
        "../ariaui/web/doc/src/markdoc/partials/progress/examples.md",
      ],
    });
    expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(
      expect.arrayContaining([
        "Root exposes progressbar semantics and reflects current range state through ARIA and data attributes",
        "default-value initializes uncontrolled state once while value provides controlled-style updates",
        "Indicator inherits Root state and computes --progress-value plus rendered width from the source percentage formula",
        "docs examples include Uncontrolled and Controlled variants with source-equivalent classes and page structure",
      ]),
    );
    expect(componentSpec.parts.find((part) => part.name === "Root")?.defaultRole).toBe("progressbar");
    expect(componentSpec.parts.find((part) => part.name === "Indicator")?.defaultRole).toBeNull();
    expect(markdown).toContain("- Kind: " + String.fromCharCode(96) + componentSpec.kind + String.fromCharCode(96));
    expect(componentSpec.learnedRequirements.learningSource).toContain("../ariaui/packages/" + componentSpec.slug);
    expect(componentSpec.learnedRequirements.coverage.coveredSections).toBe(componentSpec.learnedRequirements.sections.length);
    expect(componentSpec.learnedRequirements.coverage.coveredSections).toBe(componentSpec.learnedRequirements.coverage.sourceSections);
    expect(componentSpec.learnedRequirements.coverage.requirements).toBeGreaterThanOrEqual(componentSpec.learnedRequirements.sections.length);
    expect(markdown).toContain("- Coverage: " + componentSpec.learnedRequirements.coverage.coveredSections + " of " + componentSpec.learnedRequirements.coverage.sourceSections + " documented sections are represented after native normalization.");
    expect(markdown).not.toContain("Source package:");
    expect(markdown).not.toContain("Source Package Contract");
    expect(markdown).not.toContain("@ariaui/");
    expect(markdown.replace(componentSpec.slug === "progress" ? "React context/props/refs" : "", "")).not.toMatch(/\bReact\b/);
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


  it("keeps the Progress runtime package-local and generator-durable", () => {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), "packages", "progress", "package.json"), "utf8")) as {
      scripts?: Record<string, string>;
    };
    const elementSource = readFileSync(join(process.cwd(), "packages", "progress", "src", "progress-element.ts"), "utf8");
    const stateSource = readFileSync(join(process.cwd(), "packages", "progress", "src", "progress-state.ts"), "utf8");
    const syncSource = readFileSync(join(process.cwd(), "packages", "progress", "src", "progress-sync.ts"), "utf8");
    const webComponentSource = readFileSync(join(process.cwd(), "packages", "progress", "src", "progress-web-component.ts"), "utf8");
    const partSpecSource = readFileSync(join(process.cwd(), "packages", "progress", "src", "parts", "part-spec.ts"), "utf8");
    const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");
    const generatorSource = readFileSync(join(process.cwd(), "scripts", "generate-from-ariaui.mjs"), "utf8");

    expect(packageJson.scripts?.lint).toBe("pnpm --filter @ariaui-web/utils build && tsc --noEmit -p tsconfig.build.json");
    expect(elementSource).toContain("export class ProgressElement extends AriaWebElement");
    expect(elementSource).toContain('progressPartName(this) === "Root"');
    expect(elementSource).toContain("observeProgressRoot(this)");
    expect(elementSource).toContain("disconnectProgressRoot(this)");
    expect(elementSource).toContain("syncProgressPart(this)");
    expect(stateSource).toContain("const progressRootStates = new WeakMap<HTMLElement, ProgressRootState>()");
    expect(stateSource).toContain("export function getProgressSnapshot(root: HTMLElement): ProgressSnapshot");
    expect(syncSource).toContain("export function syncProgressPart(element: HTMLElement)");
    expect(syncSource).toContain('indicator.style.setProperty("--progress-value", `${percentage}%`)');
    expect(webComponentSource).toContain("const progressPartConstructors = {");
    expect(partSpecSource).toContain('import { componentSpec, type ComponentPartName } from "../component-spec"');
    expect(partSpecSource).toContain("export function getProgressPartSpec(partName: ComponentPartName)");
    expect(utilsElementSource).not.toContain("syncProgressPart");
    expect(utilsElementSource).not.toContain("aria-progress-indicator");

    for (const part of componentSpec.parts) {
      const partSource = readFileSync(join(process.cwd(), "packages", "progress", "src", "parts", part.name + ".ts"), "utf8");

      expect(partSource).toContain('import { ProgressElement } from "../progress-element"');
      expect(partSource).toContain('getProgressPartSpec("' + part.name + '")');
      expect(partSource).toContain("extends ProgressElement");
      expect(partSource).not.toContain("createAriaWebComponent");
      expect(partSource).not.toContain("createProgressWebComponent");
    }

    expect(generatorSource).toContain("function progressElementSource()");
    expect(generatorSource).toContain('lint: name === "progress" ? "pnpm --filter @ariaui-web/utils build && tsc --noEmit -p tsconfig.build.json" : "tsc --noEmit -p tsconfig.json"');
    expect(generatorSource).toContain('const packageJson = JSON.parse(readFileSync(join(process.cwd(), "packages", "progress", "package.json"), "utf8")) as {');
    expect(generatorSource).toContain('expect(packageJson.scripts?.lint).toBe("pnpm --filter @ariaui-web/utils build && tsc --noEmit -p tsconfig.build.json");');
    expect(generatorSource).toContain("function progressStateSource()");
    expect(generatorSource).toContain("function progressSyncSource()");
    expect(generatorSource).toContain("function progressWebComponentSource()");
    expect(generatorSource).toContain("function progressPartSpecSource()");
    expect(generatorSource).toContain('if (spec.slug === "progress") {\n    return progressPartSource(part.name);\n  }');
    expect(generatorSource).toContain('if (spec.slug === "progress") {\n    return progressElementSource();\n  }');
    expect(generatorSource).toContain('if (spec.slug === "progress") {\n    return "ProgressElement";\n  }');
    expect(generatorSource).toContain('as ProgressWebElement } from "./${spec.slug}-element";');
    expect(generatorSource).toContain('export { ${factoryName} } from "./${spec.slug}-web-component";');
    expect(generatorSource).toContain("export function createProgressWebComponent(part: WebComponentPartSpec)");
    expect(generatorSource).toContain('write(join(packageRoot, "src", "progress-state.ts"), progressStateSource());');
    expect(generatorSource).toContain('write(join(packageRoot, "src", "progress-sync.ts"), progressSyncSource());');
    expect(generatorSource).toContain('write(join(packageRoot, "src", "progress-web-component.ts"), progressWebComponentSource());');
    expect(generatorSource).toContain('write(join(packageRoot, "src", "parts", "part-spec.ts"), progressPartSpecSource());');
    expect(generatorSource).toContain('const progressInternalImport = spec.slug === "progress"');
    expect(generatorSource).toContain('import { syncProgressPart } from "../src/progress-sync";');
    expect(generatorSource).toContain("type ProgressRuntimeElement = RuntimeElement & {");
    expect(generatorSource).toContain("function createProgressFixture(attributes: Record<string, string> = {})");
    expect(generatorSource).toContain('if (tagName === "aria-progress-indicator")');
    expect(generatorSource).toContain("const progressSourceParityTest =");
  });

});
