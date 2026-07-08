import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Group } from "./parts/Group";
import { Inset } from "./parts/Inset";
import { Layout } from "./parts/Layout";
import { Menu } from "./parts/Menu";
import { Panel } from "./parts/Panel";
import { Rail } from "./parts/Rail";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-sidebar", Root],
  ["aria-sidebar-group", Group],
  ["aria-sidebar-inset", Inset],
  ["aria-sidebar-layout", Layout],
  ["aria-sidebar-menu", Menu],
  ["aria-sidebar-panel", Panel],
  ["aria-sidebar-rail", Rail],
  ["aria-sidebar-trigger", Trigger],
] as const;

export function defineSidebarElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
