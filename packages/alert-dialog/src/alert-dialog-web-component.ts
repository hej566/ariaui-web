import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Action } from "./parts/Action";
import { Cancel } from "./parts/Cancel";
import { Content } from "./parts/Content";
import { Description } from "./parts/Description";
import { Icon } from "./parts/Icon";
import { Overlay } from "./parts/Overlay";
import { Portal } from "./parts/Portal";
import { Root } from "./parts/Root";
import { Title } from "./parts/Title";
import { Trigger } from "./parts/Trigger";

const alertDialogPartConstructors = {
  Action,
  Cancel,
  Content,
  Description,
  Icon,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} as const;

export function createAlertDialogWebComponent(part: WebComponentPartSpec) {
  const constructor = alertDialogPartConstructors[part.name as keyof typeof alertDialogPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/alert-dialog.");
  }

  return constructor;
}
