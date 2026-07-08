import { describe, expect, it } from "vitest";
import { getDirectionKeys, getNextIndex, getPrevIndex, isAlphanumericTypeaheadKey } from "../src";

describe("@ariaui-web/keyboard", () => {
  it("supports wrapped keyboard navigation helpers", () => {
    expect(getDirectionKeys("horizontal")).toEqual({ next: "ArrowRight", previous: "ArrowLeft" });
    expect(getNextIndex(2, 3)).toBe(0);
    expect(getPrevIndex(0, 3)).toBe(2);
    expect(isAlphanumericTypeaheadKey("a")).toBe(true);
  });
});
