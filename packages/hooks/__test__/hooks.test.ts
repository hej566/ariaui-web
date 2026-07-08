import { describe, expect, it } from "vitest";
import { createControllableState, createId } from "../src";

describe("@ariaui-web/hooks", () => {
  it("provides DOM-friendly state and id helpers", () => {
    const first = createId("case");
    const second = createId("case");
    expect(first).not.toBe(second);

    const state = createControllableState({ defaultValue: "closed" });
    state.setValue("open");
    expect(state.value).toBe("open");
  });
});
