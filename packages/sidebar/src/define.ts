import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Panel } from "./parts/Panel";
import { Trigger } from "./parts/Trigger";
import { Rail } from "./parts/Rail";
import { Inset } from "./parts/Inset";
import { Header } from "./parts/Header";
import { Content } from "./parts/Content";
import { Footer } from "./parts/Footer";
import { Group } from "./parts/Group";
import { GroupLabel } from "./parts/GroupLabel";
import { GroupAction } from "./parts/GroupAction";
import { GroupContent } from "./parts/GroupContent";
import { Menu } from "./parts/Menu";
import { MenuItem } from "./parts/MenuItem";
import { MenuButton } from "./parts/MenuButton";
import { MenuAction } from "./parts/MenuAction";
import { MenuBadge } from "./parts/MenuBadge";
import { MenuSub } from "./parts/MenuSub";
import { MenuSubItem } from "./parts/MenuSubItem";
import { MenuSubButton } from "./parts/MenuSubButton";

const definitions = [
  ["aria-sidebar", Root], ["aria-sidebar-panel", Panel], ["aria-sidebar-trigger", Trigger],
  ["aria-sidebar-rail", Rail], ["aria-sidebar-inset", Inset], ["aria-sidebar-header", Header],
  ["aria-sidebar-content", Content], ["aria-sidebar-footer", Footer], ["aria-sidebar-group", Group],
  ["aria-sidebar-group-label", GroupLabel], ["aria-sidebar-group-action", GroupAction],
  ["aria-sidebar-group-content", GroupContent], ["aria-sidebar-menu", Menu],
  ["aria-sidebar-menu-item", MenuItem], ["aria-sidebar-menu-button", MenuButton],
  ["aria-sidebar-menu-action", MenuAction], ["aria-sidebar-menu-badge", MenuBadge],
  ["aria-sidebar-menu-sub", MenuSub], ["aria-sidebar-menu-sub-item", MenuSubItem],
  ["aria-sidebar-menu-sub-button", MenuSubButton],
] as const;

export function defineSidebarElements() {
  for (const [tagName, element] of definitions) defineCustomElement(tagName, element);
}
