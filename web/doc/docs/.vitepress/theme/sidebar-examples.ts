import { animate } from "framer-motion/dom";

const installedDocuments = new WeakSet<Document>();

function bindExample(root: HTMLElement) {
  if (root.dataset.sidebarExampleBound !== undefined) return;
  root.dataset.sidebarExampleBound = "";

  const submenuTrigger = root.querySelector<HTMLElement>("[data-sidebar-submenu-trigger]");
  const submenu = root.querySelector<HTMLElement>("[data-sidebar-submenu]");
  submenuTrigger?.addEventListener("click", () => {
    const open = submenuTrigger.getAttribute("aria-expanded") !== "true";
    submenuTrigger.toggleAttribute("open", open);
    submenuTrigger.setAttribute("aria-expanded", String(open));
    submenuTrigger.querySelector<HTMLElement>(".ariaui-web-sidebar-chevron")?.toggleAttribute("data-open", open);
    if (submenu) submenu.hidden = !open;
  });

  if (root.dataset.sidebarExample !== "motion") return;
  root.addEventListener("open-change", (event) => {
    const open = (event as CustomEvent<{ open: boolean }>).detail.open;
    const panel = root.querySelector<HTMLElement>(".ariaui-web-sidebar-motion-panel");
    if (panel) animate(panel, { width: open ? 256 : 56 }, { duration: 0.2, ease: "linear" });
    for (const label of root.querySelectorAll<HTMLElement>("[data-sidebar-motion-label]")) {
      animate(label, { opacity: open ? 1 : 0, maxWidth: open ? 240 : 0 }, { duration: 0.2, ease: "linear" });
    }
    for (const accessory of root.querySelectorAll<HTMLElement>("[data-sidebar-motion-accessory]")) {
      animate(accessory, { opacity: open ? 1 : 0, maxWidth: open ? 16 : 0 }, { duration: 0.2, ease: "linear" });
    }
  });
}

function scan(document: Document) {
  for (const root of document.querySelectorAll<HTMLElement>("aria-sidebar[data-sidebar-example]")) bindExample(root);
}

export function installSidebarExamples(document: Document = window.document) {
  scan(document);
  if (installedDocuments.has(document)) return;
  installedDocuments.add(document);
  new MutationObserver(() => scan(document)).observe(document.documentElement, { childList: true, subtree: true });
}
