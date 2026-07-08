import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Action } from "./parts/Action";
import { Cancel } from "./parts/Cancel";
import { Content } from "./parts/Content";
import { Description } from "./parts/Description";
import { Icon } from "./parts/Icon";
import { Overlay } from "./parts/Overlay";
import { Portal } from "./parts/Portal";
import { Title } from "./parts/Title";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-alert-dialog", Root],
  ["aria-alert-dialog-action", Action],
  ["aria-alert-dialog-cancel", Cancel],
  ["aria-alert-dialog-content", Content],
  ["aria-alert-dialog-description", Description],
  ["aria-alert-dialog-icon", Icon],
  ["aria-alert-dialog-overlay", Overlay],
  ["aria-alert-dialog-portal", Portal],
  ["aria-alert-dialog-title", Title],
  ["aria-alert-dialog-trigger", Trigger],
] as const;

export function defineAlertDialogElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
