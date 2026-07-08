import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Action } from "./parts/Action";
import { Cancel } from "./parts/Cancel";
import { Close } from "./parts/Close";
import { Description } from "./parts/Description";
import { Root } from "./parts/Root";
import { Title } from "./parts/Title";

const alertPartConstructors = {
  Action,
  Cancel,
  Close,
  Description,
  Root,
  Title,
} as const;

export function createAlertWebComponent(part: WebComponentPartSpec) {
  const constructor = alertPartConstructors[part.name as keyof typeof alertPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/alert.");
  }

  return constructor;
}
