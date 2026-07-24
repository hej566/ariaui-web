import { defineCustomElement } from "@ariaui-web/utils";
import { definePortalElements } from "@ariaui-web/portal";
import { Root } from "./parts/Root";
import { Action } from "./parts/Action";
import { Cancel } from "./parts/Cancel";
import { Close } from "./parts/Close";
import { Content } from "./parts/Content";
import { Description } from "./parts/Description";
import { Footer } from "./parts/Footer";
import { Header } from "./parts/Header";
import { Overlay } from "./parts/Overlay";
import { Portal } from "./parts/Portal";
import { Title } from "./parts/Title";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-drawer", Root],
  ["aria-drawer-action", Action],
  ["aria-drawer-cancel", Cancel],
  ["aria-drawer-close", Close],
  ["aria-drawer-content", Content],
  ["aria-drawer-description", Description],
  ["aria-drawer-footer", Footer],
  ["aria-drawer-header", Header],
  ["aria-drawer-overlay", Overlay],
  ["aria-drawer-portal", Portal],
  ["aria-drawer-title", Title],
  ["aria-drawer-trigger", Trigger],
] as const;

export function defineDrawerElements() {
  definePortalElements();
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
