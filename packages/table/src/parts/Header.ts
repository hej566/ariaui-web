import { createTableWebComponent } from "../table-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Header");

if (!partSpec) {
  throw new Error("Missing Header part spec for @ariaui-web/table.");
}

export const Header = createTableWebComponent(partSpec);
export type HeaderElement = InstanceType<typeof Header>;
