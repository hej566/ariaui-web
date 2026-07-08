import { createFocusScopeWebComponent } from "../focus-scope-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "FocusScope");

if (!partSpec) {
  throw new Error("Missing FocusScope part spec for @ariaui-web/focus-scope.");
}

export const FocusScope = createFocusScopeWebComponent(partSpec);
export type FocusScopeElement = InstanceType<typeof FocusScope>;
