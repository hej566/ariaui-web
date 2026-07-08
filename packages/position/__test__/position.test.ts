import { describe, expect, it } from "vitest";
import { computePosition } from "../src";

describe("@ariaui-web/position", () => {
  it("computes a basic bottom placement", () => {
    const reference = document.createElement("button");
    const floating = document.createElement("div");
    reference.getBoundingClientRect = () => ({ x: 0, y: 0, left: 10, top: 20, right: 50, bottom: 60, width: 40, height: 40, toJSON: () => null });
    floating.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 20, bottom: 20, width: 20, height: 20, toJSON: () => null });

    expect(computePosition(reference, floating, { offset: 4 })).toEqual({ x: 10, y: 64, placement: "bottom" });
  });
});
