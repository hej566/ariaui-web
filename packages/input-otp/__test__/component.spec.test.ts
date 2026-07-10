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

describe("@ariaui-web/input-otp readme", () => {
  it("keeps the generated readme tied to the native custom element contract", () => {
    const markdown = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "readme.md"), "utf8");

    expect(markdown).toContain("@ariaui-web/input-otp");
    expect(markdown).toContain("Native Web Component Contract");
    expect(markdown).toContain("Learned Native Requirements");
    expect(markdown).toContain("Web Component Test Requirements");
      expect(markdown).toContain("Input OTP Source Test Parity");
    expect(markdown).toContain("../ariaui/packages/input-otp/__test__/input-otp.test.tsx");
    expect(markdown).toContain("- Source test cases: 22");
    expect(markdown).toContain("Root owns one visually hidden native text input");
    expect(markdown).toContain("Backspace deletes the focused digit");
    expect(markdown).toContain("native-composition child hosts");
    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 22,
      learningSources: [
        "../ariaui/packages/input-otp/__test__/input-otp.test.tsx",
      ],
    });
    expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
      "Root owns one visually hidden native text input with numeric input mode, one-time-code autocomplete, maxLength, and root-scoped absolute positioning",
      "Root clips entered values to maxLength and mirrors each character into Slot and InputOTPSlot hosts in DOM order",
      "docs examples include verification-code and framer-motion variants with source-equivalent group, slot, and caret classes",
    ]));
    expect(componentSpec.parts.find((part) => part.name === "Group")?.defaultRole).toBeNull();
    expect(componentSpec.parts.find((part) => part.name === "Separator")?.defaultRole).toBe("separator");
    expect(componentSpec.parts.find((part) => part.name === "InputOTPSeparator")?.defaultRole).toBe("separator");
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


  it("keeps the docs page aligned with the source Input OTP examples", () => {
    const docsPage = readFileSync(join(process.cwd(), "web", "doc", "docs", "components", componentSpec.slug + ".md"), "utf8");

    expect(docsPage).toContain("# Input OTP");
    expect(docsPage).toContain("A one-time passcode input with split slots");
    expect(docsPage).toContain("## Features");
    expect(docsPage).toContain("## Installation");
    expect(docsPage).toContain("## Examples");
    expect(docsPage).toContain("### Verification code");
    expect(docsPage).toContain("### Framer Motion");
    expect(docsPage).toContain("## Anatomy");
    expect(docsPage).toContain("## API Reference");
    expect(docsPage).toContain("## Keyboard");
    expect(docsPage).toContain("## Accessibility");
    expect(docsPage).toContain("<aria-input-otp");
    expect(docsPage).toContain("<aria-input-otp-group");
    expect(docsPage).toContain("<aria-input-otp-slot");
    expect(docsPage).toContain("<aria-input-otp-separator");
    expect(docsPage).toContain("<aria-input-otp-input-otp");
    expect(docsPage).toContain("<aria-input-otp-input-otpgroup");
    expect(docsPage).toContain("max-length=\"6\"");
    expect(docsPage).toContain("flex items-center gap-2");
    expect(docsPage).toContain("relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-input text-sm font-medium text-foreground  data-[active]:outline-2");
    expect(docsPage).toContain("pointer-events-none absolute left-1/2 top-1/2 h-4 w-px");
    expect(docsPage).toContain("native-composition");
    expect(docsPage).not.toContain("data-example-part=\"Root\">Root</aria-input-otp>");
  });


  it("keeps native input-otp behavior in package-local modules", () => {
    const elementSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", componentSpec.slug + "-element.ts"), "utf8");
    const domSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "input-otp-dom.ts"), "utf8");
    const syncSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "input-otp-sync.ts"), "utf8");
    const actionsSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "input-otp-actions.ts"), "utf8");
    const webComponentSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "input-otp-web-component.ts"), "utf8");
    const partSpecSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "part-spec.ts"), "utf8");
    const rootSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Root.ts"), "utf8");
    const slotSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "Slot.ts"), "utf8");
    const aliasSlotSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", "InputOTPSlot.ts"), "utf8");
    const utilsElementSource = readFileSync(join(process.cwd(), "packages", "utils", "src", "aria-web-element.ts"), "utf8");

    expect(elementSource).toContain("extends AriaWebElement");
    expect(elementSource).toContain('packageSlug = "' + componentSpec.slug + '"');
    expect(elementSource).not.toContain("WebComponentPartSpec");
    expect(elementSource).not.toContain("createInputOtpWebComponent");
    expect(domSource).toContain("inputOtpSlots");
    expect(domSource).toContain("ownedInputOtpInput");
    expect(syncSource).toContain("ensureInputOtpControl");
    expect(syncSource).toContain("syncInputOtpPart");
    expect(syncSource).toContain("MutationObserver");
    expect(syncSource).not.toContain("extends AriaWebElement");
    expect(actionsSource).toContain("bindInputOtpPart");
    expect(actionsSource).toContain("handleInputOtpKeyDown");
    expect(actionsSource).not.toContain("extends AriaWebElement");
    expect(webComponentSource).toContain("WebComponentPartSpec");
    expect(webComponentSource).toContain("inputOtpPartConstructors");
    expect(partSpecSource).toContain("getInputOtpPartSpec");
    expect(rootSource).toContain("extends InputOtpElement");
    expect(slotSource).toContain("extends InputOtpElement");
    expect(aliasSlotSource).toContain("extends InputOtpElement");
    expect(utilsElementSource).not.toContain("syncInputOtpPart");
    expect(utilsElementSource).not.toContain("ensureInputOtpControl");
    expect(utilsElementSource).not.toContain("aria-input-otp");

    for (const part of componentSpec.parts) {
      const partSource = readFileSync(join(process.cwd(), "packages", componentSpec.slug, "src", "parts", part.name + ".ts"), "utf8");
      expect(partSource).not.toContain("createAriaWebComponent");
      expect(partSource).not.toContain("createInputOtpWebComponent");
      expect(partSource).toContain("extends InputOtpElement");
    }
  });

});
