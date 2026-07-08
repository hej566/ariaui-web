import { createTableWebComponent } from "../table-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Caption");

if (!partSpec) {
  throw new Error("Missing Caption part spec for @ariaui-web/table.");
}

export const Caption = createTableWebComponent(partSpec);
export type CaptionElement = InstanceType<typeof Caption>;
