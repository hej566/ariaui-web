import { createTableWebComponent } from "../table-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/table.");
}

export const Root = createTableWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
