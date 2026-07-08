import { describe, expect, it } from "vitest";
import { dark, generateCSS, light, primitives } from "../src";

describe("@ariaui-web/tokens", () => {
  it("generates CSS variables for light and dark token modes", () => {
    expect(primitives.blue[600]).toContain("%");
    expect(light.background).toContain("oklch");
    expect(dark.foreground).toContain("oklch");
    expect(generateCSS()).toContain("--color-background");
  });
});
