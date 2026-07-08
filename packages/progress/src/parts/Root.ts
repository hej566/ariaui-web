import { createProgressWebComponent } from "../progress-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/progress.");
}

export const Root = createProgressWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
