import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Action } from "./parts/Action";
import { Cancel } from "./parts/Cancel";
import { Close } from "./parts/Close";
import { Content } from "./parts/Content";
import { Description } from "./parts/Description";
import { Overlay } from "./parts/Overlay";
import { Portal } from "./parts/Portal";
import { Title } from "./parts/Title";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-dialog", Root],
  ["aria-dialog-action", Action],
  ["aria-dialog-cancel", Cancel],
  ["aria-dialog-close", Close],
  ["aria-dialog-content", Content],
  ["aria-dialog-description", Description],
  ["aria-dialog-overlay", Overlay],
  ["aria-dialog-portal", Portal],
  ["aria-dialog-title", Title],
  ["aria-dialog-trigger", Trigger],
] as const;

export function defineDialogElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
