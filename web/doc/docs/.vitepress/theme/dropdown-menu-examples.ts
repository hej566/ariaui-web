type DropdownMenuExampleRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

type DropdownMenuExampleViewport = {
  width: number;
  height: number;
};

export type DropdownMenuExamplePosition = {
  top: number;
  left: number;
  side: "top" | "right" | "bottom" | "left";
  align: "start";
};

type DropdownMenuExamplePlacement = "bottom" | "right";

type DropdownMenuExampleScrollState = {
  bodyOverflow: string;
  documentOverflow: string;
};

const installedDropdownMenuExampleDocuments = new WeakSet<Document>();
const pendingDropdownMenuExampleDocuments = new WeakSet<Document>();
const dropdownMenuExampleScrollStates = new WeakMap<Document, DropdownMenuExampleScrollState>();
const dropdownMenuExampleOffset = 5;
const dropdownMenuExamplePadding = 8;

function clamp(value: number, min: number, max: number) {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

export function computeDropdownMenuExamplePosition(
  reference: DropdownMenuExampleRect,
  floating: Pick<DropdownMenuExampleRect, "width" | "height">,
  viewport: DropdownMenuExampleViewport,
  placement: DropdownMenuExamplePlacement = "bottom",
): DropdownMenuExamplePosition {
  if (placement === "right") {
    const rightSpace = viewport.width - reference.right - dropdownMenuExamplePadding;
    const leftSpace = reference.left - dropdownMenuExamplePadding;
    const side = reference.right + dropdownMenuExampleOffset + floating.width > viewport.width - dropdownMenuExamplePadding
      && leftSpace >= rightSpace
      ? "left"
      : "right";
    const left = side === "right"
      ? reference.right + dropdownMenuExampleOffset
      : reference.left - dropdownMenuExampleOffset - floating.width;

    return {
      top: clamp(reference.top, dropdownMenuExamplePadding, viewport.height - floating.height - dropdownMenuExamplePadding),
      left: clamp(left, dropdownMenuExamplePadding, viewport.width - floating.width - dropdownMenuExamplePadding),
      side,
      align: "start",
    };
  }

  const belowSpace = viewport.height - reference.bottom - dropdownMenuExamplePadding;
  const aboveSpace = reference.top - dropdownMenuExamplePadding;
  const side = reference.bottom + dropdownMenuExampleOffset + floating.height > viewport.height - dropdownMenuExamplePadding
    && aboveSpace >= belowSpace
    ? "top"
    : "bottom";
  const top = side === "bottom"
    ? reference.bottom + dropdownMenuExampleOffset
    : reference.top - dropdownMenuExampleOffset - floating.height;

  return {
    top: clamp(top, dropdownMenuExamplePadding, viewport.height - floating.height - dropdownMenuExamplePadding),
    left: clamp(reference.left, dropdownMenuExamplePadding, viewport.width - floating.width - dropdownMenuExamplePadding),
    side,
    align: "start",
  };
}

function setDropdownMenuExamplePosition(element: HTMLElement, position: DropdownMenuExamplePosition) {
  element.dataset.side = position.side;
  element.dataset.align = position.align;
  element.style.position = "fixed";
  element.style.top = position.top + "px";
  element.style.left = position.left + "px";
}

function clearDropdownMenuExamplePosition(element: HTMLElement) {
  delete element.dataset.side;
  delete element.dataset.align;
  element.style.removeProperty("position");
  element.style.removeProperty("top");
  element.style.removeProperty("left");
}

function positionDropdownMenuExampleContent(root: HTMLElement) {
  const ownerDocument = root.ownerDocument;
  const defaultView = ownerDocument.defaultView;
  const trigger = root.querySelector<HTMLElement>(":scope > aria-dropdown-menu-trigger");
  const content = root.querySelector<HTMLElement>(":scope > aria-dropdown-menu-content");

  if (!defaultView || !trigger || !content) {
    return;
  }

  if (content.hidden || !root.hasAttribute("open")) {
    clearDropdownMenuExamplePosition(content);
    return;
  }

  setDropdownMenuExamplePosition(content, computeDropdownMenuExamplePosition(
    trigger.getBoundingClientRect(),
    content.getBoundingClientRect(),
    {
      width: defaultView.innerWidth,
      height: defaultView.innerHeight,
    },
  ));
}

function positionDropdownMenuExampleSubContent(sub: HTMLElement) {
  const ownerDocument = sub.ownerDocument;
  const defaultView = ownerDocument.defaultView;
  const trigger = sub.querySelector<HTMLElement>(":scope > aria-dropdown-menu-sub-trigger");
  const content = sub.querySelector<HTMLElement>(":scope > aria-dropdown-menu-sub-content");

  if (!defaultView || !trigger || !content) {
    return;
  }

  if (content.hidden || !sub.hasAttribute("open")) {
    clearDropdownMenuExamplePosition(content);
    return;
  }

  setDropdownMenuExamplePosition(content, computeDropdownMenuExamplePosition(
    trigger.getBoundingClientRect(),
    content.getBoundingClientRect(),
    {
      width: defaultView.innerWidth,
      height: defaultView.innerHeight,
    },
    "right",
  ));
}

export function syncDropdownMenuExampleScrollLock(ownerDocument: Document = document) {
  const hasOpenMenu = Boolean(ownerDocument.querySelector('.ariaui-web-preview[data-component="dropdown-menu"] aria-dropdown-menu[open]'));
  const documentElement = ownerDocument.documentElement;
  const body = ownerDocument.body;

  if (!body) {
    return;
  }

  if (hasOpenMenu && !dropdownMenuExampleScrollStates.has(ownerDocument)) {
    dropdownMenuExampleScrollStates.set(ownerDocument, {
      bodyOverflow: body.style.overflow,
      documentOverflow: documentElement.style.overflow,
    });
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    documentElement.dataset.ariauiWebDropdownMenuScrollLocked = "true";
    return;
  }

  if (!hasOpenMenu && dropdownMenuExampleScrollStates.has(ownerDocument)) {
    const previous = dropdownMenuExampleScrollStates.get(ownerDocument);
    dropdownMenuExampleScrollStates.delete(ownerDocument);
    body.style.overflow = previous?.bodyOverflow ?? "";
    documentElement.style.overflow = previous?.documentOverflow ?? "";
    delete documentElement.dataset.ariauiWebDropdownMenuScrollLocked;
  }
}

export function syncDropdownMenuExamples(ownerDocument: Document = document) {
  for (const root of Array.from(ownerDocument.querySelectorAll<HTMLElement>('.ariaui-web-preview[data-component="dropdown-menu"] aria-dropdown-menu'))) {
    positionDropdownMenuExampleContent(root);
  }

  for (const sub of Array.from(ownerDocument.querySelectorAll<HTMLElement>('.ariaui-web-preview[data-component="dropdown-menu"] aria-dropdown-menu-sub'))) {
    positionDropdownMenuExampleSubContent(sub);
  }

  syncDropdownMenuExampleScrollLock(ownerDocument);
}

function queueDropdownMenuExampleSync(ownerDocument: Document) {
  const defaultView = ownerDocument.defaultView;
  if (!defaultView || pendingDropdownMenuExampleDocuments.has(ownerDocument)) {
    return;
  }

  pendingDropdownMenuExampleDocuments.add(ownerDocument);
  defaultView.requestAnimationFrame(() => {
    pendingDropdownMenuExampleDocuments.delete(ownerDocument);
    syncDropdownMenuExamples(ownerDocument);
  });
}

export function installDropdownMenuExamples(ownerDocument: Document = document) {
  if (installedDropdownMenuExampleDocuments.has(ownerDocument)) {
    return;
  }

  const defaultView = ownerDocument.defaultView;
  if (!defaultView) {
    return;
  }

  installedDropdownMenuExampleDocuments.add(ownerDocument);

  const scheduleSync = () => {
    queueDropdownMenuExampleSync(ownerDocument);
  };
  const observer = new MutationObserver(scheduleSync);

  ownerDocument.addEventListener("click", scheduleSync, true);
  ownerDocument.addEventListener("keydown", scheduleSync, true);
  ownerDocument.addEventListener("mouseover", scheduleSync, true);
  defaultView.addEventListener("resize", scheduleSync);
  defaultView.addEventListener("scroll", scheduleSync, true);
  observer.observe(ownerDocument.documentElement, {
    attributes: true,
    attributeFilter: ["hidden", "open"],
    childList: true,
    subtree: true,
  });

  scheduleSync();
}
