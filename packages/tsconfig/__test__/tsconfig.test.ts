import { describe, expect, it } from "vitest";
import config from "../src";

describe("@ariaui-web/tsconfig", () => {
  it("exports a DOM-ready TypeScript config", () => {
    expect(config.compilerOptions.lib).toContain("DOM");
    expect(config.compilerOptions.strict).toBe(true);
  });
});
