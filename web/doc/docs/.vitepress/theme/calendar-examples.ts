import { computeSelectExamplePosition } from "./select-examples";

const installedCalendarExampleDocuments = new WeakSet<Document>();
const pendingCalendarExampleDocuments = new WeakSet<Document>();
const pendingCalendarSelectScrollRoots = new WeakSet<HTMLElement>();

const calendarExampleMonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function requestCalendarExampleFrame(defaultView: Window, callback: () => void) {
  let called = false;
  const run = () => {
    if (called) {
      return;
    }
    called = true;
    callback();
  };

  if (typeof defaultView.requestAnimationFrame === "function") {
    defaultView.requestAnimationFrame(run);
  }
  defaultView.setTimeout(run, 0);
}

function calendarExampleRoots(doc: Document) {
  return Array.from(doc.querySelectorAll<HTMLElement>('.ariaui-web-preview[data-component="calendar"] aria-calendar'));
}

function parseCalendarExampleDate(value: string | null) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

function calendarExampleDatePart(date: Date) {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function calendarExampleVisibleMonth(root: Element) {
  return parseCalendarExampleDate(root.getAttribute("visible-month"))
    ?? parseCalendarExampleDate(root.getAttribute("value")?.split(",")[0] ?? null)
    ?? new Date();
}

function calendarSelects(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>('aria-select[data-calendar-select]'))
    .filter((select) => select.closest("aria-calendar") === root);
}

function calendarSelectContent(select: HTMLElement) {
  const portal = select.querySelector<HTMLElement>(':scope > aria-portal[data-select-portal="content"]');
  const contentId = portal?.dataset.selectPortalContent;
  return contentId
    ? select.ownerDocument.getElementById(contentId)
    : select.querySelector<HTMLElement>(":scope > aria-select-content");
}

function calendarSelectTrigger(select: HTMLElement) {
  return Array.from(select.querySelectorAll<HTMLElement>("aria-select-trigger"))
    .find((trigger) => trigger.closest("aria-select") === select) ?? null;
}

function calendarSelectLabel(select: HTMLElement) {
  return select.querySelector<HTMLElement>("[data-select-trigger-label], [data-calendar-select-trigger-label]");
}

function setCalendarSelectContentPosition(element: HTMLElement, position: ReturnType<typeof computeSelectExamplePosition>) {
  element.dataset.side = position.side;
  element.dataset.align = position.align;
  element.style.position = "fixed";
  element.style.top = position.top + "px";
  element.style.left = position.left + "px";
  element.style.right = "auto";
}

function clearCalendarSelectContentPosition(element: HTMLElement) {
  delete element.dataset.side;
  delete element.dataset.align;
  element.style.removeProperty("position");
  element.style.removeProperty("top");
  element.style.removeProperty("left");
  element.style.removeProperty("right");
}

function setCalendarSelectValue(select: HTMLElement, value: string) {
  if (select.getAttribute("value") !== value) {
    select.setAttribute("value", value);
  }
}

function syncCalendarMonthYearSelect(select: HTMLElement, visibleMonth: Date) {
  const type = select.getAttribute("data-calendar-select");
  const label = calendarSelectLabel(select);
  const value = type === "year" ? String(visibleMonth.getFullYear()) : String(visibleMonth.getMonth());
  const labelText = type === "year"
    ? String(visibleMonth.getFullYear())
    : calendarExampleMonthNames[visibleMonth.getMonth()] ?? "";

  setCalendarSelectValue(select, value);
  if (label && label.textContent !== labelText) {
    label.textContent = labelText;
  }
}

function positionCalendarSelectContent(select: HTMLElement) {
  const ownerDocument = select.ownerDocument;
  const defaultView = ownerDocument.defaultView;
  const trigger = calendarSelectTrigger(select);
  const content = calendarSelectContent(select);

  if (!defaultView || !trigger || !content) {
    return;
  }

  if (content.hidden || !select.hasAttribute("open")) {
    clearCalendarSelectContentPosition(content);
    return;
  }

  setCalendarSelectContentPosition(content, computeSelectExamplePosition(
    trigger.getBoundingClientRect(),
    content.getBoundingClientRect(),
    {
      width: defaultView.innerWidth,
      height: defaultView.innerHeight,
    },
  ));
}

export function syncCalendarExamples(doc: Document = document) {
  for (const root of calendarExampleRoots(doc)) {
    const visibleMonth = calendarExampleVisibleMonth(root);
    for (const select of calendarSelects(root)) {
      syncCalendarMonthYearSelect(select, visibleMonth);
      positionCalendarSelectContent(select);
    }
  }
}

function queueCalendarExampleSync(doc: Document) {
  const defaultView = doc.defaultView;
  if (!defaultView || pendingCalendarExampleDocuments.has(doc)) {
    return;
  }

  pendingCalendarExampleDocuments.add(doc);
  requestCalendarExampleFrame(defaultView, () => {
    pendingCalendarExampleDocuments.delete(doc);
    syncCalendarExamples(doc);
  });
}

function calendarSelectFromEvent(event: Event) {
  const target = event.target instanceof Element ? event.target : null;
  let select = target?.closest<HTMLElement>('aria-select[data-calendar-select]') ?? null;
  if (!select) {
    const content = target?.closest<HTMLElement>("aria-select-content");
    const portal = content
      ? Array.from(content.ownerDocument.querySelectorAll<HTMLElement>('aria-portal[data-select-portal="content"]'))
        .find((candidate) => candidate.dataset.selectPortalContent === content.id)
      : null;
    select = portal?.closest<HTMLElement>('aria-select[data-calendar-select]') ?? null;
  }
  if (!select?.closest('.ariaui-web-preview[data-component="calendar"]')) {
    return null;
  }

  return select;
}

function isCalendarSelectNavigationKey(event: KeyboardEvent) {
  return event.key === "ArrowDown"
    || event.key === "ArrowUp"
    || event.key === "Home"
    || event.key === "End"
    || (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey);
}

function calendarSelectActiveOption(select: HTMLElement) {
  const content = calendarSelectContent(select);
  const activeId = content?.getAttribute("aria-activedescendant");
  const activeElement = activeId ? select.ownerDocument.getElementById(activeId) : null;

  if (activeElement instanceof HTMLElement && content?.contains(activeElement)) {
    return activeElement;
  }

  return Array.from(content?.querySelectorAll<HTMLElement>("aria-select-option") ?? [])
    .find((option) => option.getAttribute("data-active") === "true") ?? null;
}

function scrollCalendarSelectOptionIntoView(option: HTMLElement) {
  const content = option.closest<HTMLElement>("aria-select-content");

  if (!content || content.clientHeight <= 0 || option.offsetHeight <= 0) {
    return;
  }

  const optionTop = option.offsetTop;
  const optionBottom = optionTop + option.offsetHeight;
  const visibleTop = content.scrollTop;
  const visibleBottom = visibleTop + content.clientHeight;
  let nextScrollTop = visibleTop;

  if (optionTop < visibleTop) {
    nextScrollTop = optionTop;
  } else if (optionBottom > visibleBottom) {
    nextScrollTop = optionBottom - content.clientHeight;
  }

  if (nextScrollTop === visibleTop) {
    return;
  }

  const maxScrollTop = Math.max(0, content.scrollHeight - content.clientHeight);
  const top = Math.min(Math.max(0, nextScrollTop), maxScrollTop);

  if (typeof content.scrollTo === "function") {
    content.scrollTo({ top, behavior: "auto" });
  } else {
    content.scrollTop = top;
  }
}

function syncCalendarSelectActiveOptionScroll(select: HTMLElement) {
  const option = calendarSelectActiveOption(select);

  if (option) {
    scrollCalendarSelectOptionIntoView(option);
  }
}

function queueCalendarSelectActiveOptionScroll(select: HTMLElement) {
  const defaultView = select.ownerDocument.defaultView;

  if (!defaultView || pendingCalendarSelectScrollRoots.has(select)) {
    return;
  }

  pendingCalendarSelectScrollRoots.add(select);
  requestCalendarExampleFrame(defaultView, () => {
    pendingCalendarSelectScrollRoots.delete(select);
    syncCalendarSelectActiveOptionScroll(select);
  });
}

function handleCalendarSelectValueChange(event: Event, doc: Document) {
  const select = calendarSelectFromEvent(event);
  const root = select?.closest<HTMLElement>("aria-calendar");
  if (!select || !root) {
    return;
  }

  const visibleMonth = calendarExampleVisibleMonth(root);
  const value = select.getAttribute("value") ?? "";
  const numericValue = Number(value);
  const type = select.getAttribute("data-calendar-select");
  if (!Number.isInteger(numericValue) || (type === "month" && (numericValue < 0 || numericValue > 11))) {
    return;
  }

  const nextDate = type === "year"
    ? new Date(numericValue, visibleMonth.getMonth(), visibleMonth.getDate())
    : new Date(visibleMonth.getFullYear(), numericValue, visibleMonth.getDate());

  if (!Number.isFinite(nextDate.getTime())) {
    return;
  }

  root.setAttribute("visible-month", calendarExampleDatePart(nextDate));
  syncCalendarExamples(doc);
}

export function installCalendarExamples(doc: Document = document) {
  if (installedCalendarExampleDocuments.has(doc)) {
    return;
  }

  installedCalendarExampleDocuments.add(doc);
  doc.addEventListener("valuechange", (event) => {
    handleCalendarSelectValueChange(event, doc);
    queueCalendarExampleSync(doc);
  });
  doc.addEventListener("click", () => queueCalendarExampleSync(doc), true);
  doc.addEventListener("keydown", (event) => {
    const select = calendarSelectFromEvent(event);

    if (select && isCalendarSelectNavigationKey(event)) {
      queueCalendarSelectActiveOptionScroll(select);
    }

    queueCalendarExampleSync(doc);
  }, true);
  const defaultView = doc.defaultView;
  defaultView?.addEventListener("resize", () => queueCalendarExampleSync(doc));
  defaultView?.addEventListener("scroll", () => queueCalendarExampleSync(doc), true);

  if (doc.body && typeof MutationObserver !== "undefined") {
    new MutationObserver(() => queueCalendarExampleSync(doc)).observe(doc.body, {
      attributes: true,
      attributeFilter: ["visible-month", "value", "open", "hidden"],
      childList: true,
      subtree: true,
    });
  }

  syncCalendarExamples(doc);
}
