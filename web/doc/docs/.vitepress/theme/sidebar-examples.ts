import { animate } from "framer-motion/dom";

const installedDocuments = new WeakSet<Document>();
const motionAnimations = new WeakMap<HTMLElement, ReturnType<typeof animate>>();

function runMotionAnimation(
  element: HTMLElement,
  keyframes: Parameters<typeof animate>[1],
  options: Parameters<typeof animate>[2],
) {
  motionAnimations.get(element)?.stop();
  const controls = animate(element, keyframes, options);
  motionAnimations.set(element, controls);
  return controls;
}

function animateMotionSubtree(root: HTMLElement, open: boolean) {
  const subtree = root.querySelector<HTMLElement>("[data-sidebar-motion-subtree]");
  if (!subtree) return;

  subtree.hidden = false;
  subtree.style.pointerEvents = open ? "auto" : "none";
  const controls = runMotionAnimation(
    subtree,
    { height: open ? "auto" : 0, opacity: open ? 1 : 0 },
    { duration: 0.2, ease: "linear" },
  );
  for (const [index, item] of Array.from(subtree.querySelectorAll<HTMLElement>("[data-sidebar-motion-subtree-item]")).entries()) {
    runMotionAnimation(item, { opacity: open ? 1 : 0, y: open ? 0 : -4 }, {
      duration: 0.15,
      delay: open ? index * 0.05 : 0,
      ease: "linear",
    });
  }
  if (!open) {
    void controls.then(() => {
      if (subtree.style.pointerEvents === "none") subtree.hidden = true;
    });
  }
}

function motionSelectContent(root: HTMLElement) {
  const portal = root.querySelector<HTMLElement>('aria-portal[data-select-portal="content"]');
  return portal?.dataset.selectPortalContent
    ? root.ownerDocument.getElementById(portal.dataset.selectPortalContent)
    : null;
}

function animateMotionSelect(root: HTMLElement, open: boolean, initial = false) {
  const content = motionSelectContent(root);
  if (!content) return;

  content.style.pointerEvents = open ? "auto" : "none";
  if (initial) {
    delete content.dataset.sidebarMotionExiting;
    content.style.opacity = open ? "1" : "0";
    content.style.transform = open ? "none" : "translateY(-4px) scale(0.98)";
    content.style.visibility = open ? "visible" : "hidden";
    return;
  }
  if (!open) content.dataset.sidebarMotionExiting = "";

  const start = () => {
    if (open && !root.hasAttribute("open")) return;
    if (open) {
      delete content.dataset.sidebarMotionExiting;
      content.style.transformOrigin = content.dataset.side === "top" ? "bottom left" : "top left";
      content.style.visibility = "visible";
    }
    const controls = runMotionAnimation(content, {
      opacity: open ? 1 : 0,
      scale: open ? 1 : 0.98,
      y: open ? 0 : -4,
    }, { duration: 0.15, ease: "linear" });
    if (!open) {
      void controls.then(() => {
        if (root.hasAttribute("open")) return;
        delete content.dataset.sidebarMotionExiting;
        content.style.visibility = "hidden";
        content.style.position = "";
        content.style.top = "";
        content.style.left = "";
        delete content.dataset.side;
        delete content.dataset.align;
      });
    }
  };

  if (open) {
    root.ownerDocument.defaultView?.requestAnimationFrame(() => {
      root.ownerDocument.defaultView?.requestAnimationFrame(start);
    });
  } else {
    start();
  }
}

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
    if (root.dataset.sidebarExample === "motion") {
      animateMotionSubtree(root, open && root.dataset.state !== "collapsed");
    } else if (submenu) {
      submenu.hidden = !open;
    }
  });

  if (root.dataset.sidebarExample !== "motion") return;
  const motionSelectRoots = Array.from(root.querySelectorAll<HTMLElement>("aria-select[data-sidebar-motion-select]"));
  for (const select of motionSelectRoots) animateMotionSelect(select, select.hasAttribute("open"), true);
  new MutationObserver((records) => {
    for (const record of records) {
      const select = record.target as HTMLElement;
      if (select.matches("aria-select[data-sidebar-motion-select]")) {
        animateMotionSelect(select, select.hasAttribute("open"));
      }
    }
  }).observe(root, { attributes: true, attributeFilter: ["open"], subtree: true });
  root.addEventListener("open-change", (event) => {
    const open = (event as CustomEvent<{ open: boolean }>).detail.open;
    const panel = root.querySelector<HTMLElement>(".ariaui-web-sidebar-motion-panel");
    if (panel) animate(panel, { width: open ? 256 : 56 }, { duration: 0.2, ease: "linear" });
    for (const label of root.querySelectorAll<HTMLElement>("[data-sidebar-motion-label]")) {
      animate(label, { opacity: open ? 1 : 0, maxWidth: open ? 240 : 0 }, { duration: 0.2, ease: "linear" });
    }
    for (const flex of root.querySelectorAll<HTMLElement>("[data-sidebar-motion-flex]")) {
      animate(flex, { flex: open ? 1 : 0, maxWidth: open ? 999 : 0, opacity: open ? 1 : 0 }, { duration: 0.2, ease: "linear" });
    }
    for (const accessory of root.querySelectorAll<HTMLElement>("[data-sidebar-motion-accessory]")) {
      animate(accessory, { marginLeft: open ? "auto" : 0, opacity: open ? 1 : 0, maxWidth: open ? 16 : 0 }, { duration: 0.2, ease: "linear" });
    }
    animateMotionSubtree(root, open && submenuTrigger?.getAttribute("aria-expanded") === "true");
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
