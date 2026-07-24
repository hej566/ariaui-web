import { afterEach, describe, expect, it, vi } from "vitest";
import {
  componentSpec,
  createDatepickerElement,
  defineDatepickerElements,
} from "../src";
import {
  createApplyInputMask,
  defaultFormatInput,
  defaultParseInput,
  formatDateValue,
  parseIsoDate,
  parseMonthDayYear,
} from "../src/datepicker-input";
import { applyMask, formatMaskedDateDigits } from "../src/masking";

type DatepickerRootElement = HTMLElement & {
  open: boolean;
  value: string;
  visibleMonth: string;
};

function flush() {
  return Promise.resolve().then(() => Promise.resolve());
}

function rect(x: number, y: number, width: number, height: number) {
  return new DOMRect(x, y, width, height);
}

function enabledCell(root: ParentNode, date: string) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-calendar-cell"))
    .find((cell) => cell.getAttribute("date") === date && cell.getAttribute("aria-disabled") !== "true");
}

function inputControl(host: Element) {
  const input = host.querySelector("input");
  expect(input).toBeInstanceOf(HTMLInputElement);
  return input as HTMLInputElement;
}

function datepickerContent() {
  const content = document.querySelector<HTMLElement>("aria-datepicker-content");
  expect(content).toBeInstanceOf(HTMLElement);
  return content as HTMLElement;
}

function renderSingleDatepicker() {
  document.body.innerHTML = `
    <aria-datepicker mode="single" default-value="2025-01-20" default-visible-month="2025-01-01">
      <aria-datepicker-label>Date of birth</aria-datepicker-label>
      <div>
        <aria-datepicker-input aria-label="Date input" placeholder="Select date"></aria-datepicker-input>
        <aria-datepicker-trigger aria-label="Open date picker">Open</aria-datepicker-trigger>
      </div>
      <aria-datepicker-content>
        <aria-datepicker-calendar>
          <aria-calendar-header>
            <aria-calendar-header-previous aria-label="Previous month"></aria-calendar-header-previous>
            <aria-calendar-header-month></aria-calendar-header-month>
            <aria-calendar-header-year></aria-calendar-header-year>
            <aria-calendar-header-next aria-label="Next month"></aria-calendar-header-next>
          </aria-calendar-header>
          <aria-calendar-body></aria-calendar-body>
        </aria-datepicker-calendar>
      </aria-datepicker-content>
    </aria-datepicker>
  `;
  return document.querySelector("aria-datepicker") as DatepickerRootElement;
}

function renderRangeDatepicker() {
  document.body.innerHTML = `
    <aria-datepicker mode="range" default-visible-month="2025-01-01" input-mask="mdy">
      <aria-datepicker-label>Date range</aria-datepicker-label>
      <aria-datepicker-input aria-label="Date range input"></aria-datepicker-input>
      <aria-datepicker-trigger>Choose range</aria-datepicker-trigger>
      <aria-datepicker-content>
        <aria-datepicker-calendar>
          <aria-calendar-body></aria-calendar-body>
        </aria-datepicker-calendar>
      </aria-datepicker-content>
    </aria-datepicker>
  `;
  return document.querySelector("aria-datepicker") as DatepickerRootElement;
}

afterEach(() => {
  vi.restoreAllMocks();
  document.body.replaceChildren();
});

describe("@ariaui-web/datepicker ariaui parity", () => {
  it("exposes the same planned public part model as the source datepicker package", () => {
    const partNames = componentSpec.parts.map((part) => part.name);

    expect(partNames).toEqual([
      "Root",
      "Label",
      "Trigger",
      "Input",
      "Content",
      "Calendar",
      "CalendarHeader",
      "CalendarPrevious",
      "CalendarMonth",
      "CalendarMonthSelect",
      "CalendarYear",
      "CalendarYearSelect",
      "CalendarNext",
      "CalendarBody",
    ]);

    expect(componentSpec.parts.map((part) => part.tagName)).toEqual([
      "aria-datepicker",
      "aria-datepicker-label",
      "aria-datepicker-trigger",
      "aria-datepicker-input",
      "aria-datepicker-content",
      "aria-datepicker-calendar",
      "aria-datepicker-calendar-header",
      "aria-datepicker-calendar-previous",
      "aria-datepicker-calendar-month",
      "aria-datepicker-calendar-month-select",
      "aria-datepicker-calendar-year",
      "aria-datepicker-calendar-year-select",
      "aria-datepicker-calendar-next",
      "aria-datepicker-calendar-body",
    ]);

    defineDatepickerElements();
    for (const part of componentSpec.parts) {
      expect(createDatepickerElement(part.name).tagName.toLowerCase()).toBe(part.tagName);
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("matches source datepicker parsing, formatting, and mask helper behavior", () => {
    expect(parseMonthDayYear("02/29/2024")).toEqual(new Date(2024, 1, 29));
    expect(parseMonthDayYear("02/30/2024")).toBeUndefined();
    expect(parseIsoDate("2024-02-29")).toEqual(new Date(2024, 1, 29));
    expect(parseIsoDate("2024-02-30")).toBeUndefined();
    expect(formatDateValue(new Date(2024, 1, 3), "iso")).toBe("2024-02-03");
    expect(defaultParseInput("01/01/2024 - 01/02/2024", "range", " - ")).toEqual({
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 2),
    });
    expect(defaultParseInput("01/01/2024 - bad", "range", " - ")).toBeUndefined();
    expect(defaultFormatInput({ start: new Date(2024, 0, 1) }, "range", "mdy", " - ")).toBe("01/01/2024 - ");

    expect(formatMaskedDateDigits("12312026", "mdy")).toBe("12/31/2026");
    expect(formatMaskedDateDigits("20260530", "iso")).toBe("2026-05-30");
    expect(
      applyMask(
        {
          delimiter: " - ",
          mask: "mdy",
          mode: "single",
          text: "12/34",
          previousText: "12/34",
          inputType: "deleteContentForward",
          selectionStart: 0,
          selectionEnd: 2,
        },
        "single",
        " - ",
      ).text,
    ).toBe("  /34");
    expect(
      createApplyInputMask({
        mode: "range",
        inputMask: "mdy",
        maskDelimiter: " - ",
      })({
        text: "0120202501252025",
        previousText: "",
        selectionStart: 0,
        selectionEnd: 0,
        inputType: "insertFromPaste",
      }).text,
    ).toBe("01/20/2025 - 01/25/2025");
  });

  it("deletes masked input digits from right to left", async () => {
    defineDatepickerElements();
    const root = renderSingleDatepicker();
    root.setAttribute("input-mask", "mdy");
    await flush();
    const input = inputControl(root.querySelector("aria-datepicker-input")!);

    const backspace = () => {
      input.setSelectionRange(input.value.length, input.value.length);
      input.dispatchEvent(new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        inputType: "deleteContentBackward",
      }));
      input.value = input.value.slice(0, -1);
      input.setSelectionRange(input.value.length, input.value.length);
      input.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        inputType: "deleteContentBackward",
      }));
    };

    backspace();
    expect(input.value).toBe("01/20/202");
    expect(input.selectionStart).toBe(9);

    backspace();
    expect(input.value).toBe("01/20/20");
    expect(input.selectionStart).toBe(8);
  });

  it("shows a typed mask delimiter before the next empty segment", () => {
    expect(
      applyMask(
        {
          data: "/",
          delimiter: " - ",
          inputType: "insertText",
          mask: "mdy",
          mode: "single",
          previousText: "",
          selectionEnd: 0,
          selectionStart: 0,
          text: "/",
        },
        "single",
        " - ",
      ),
    ).toEqual({
      selectionEnd: 1,
      selectionStart: 1,
      text: "/",
    });

    expect(
      applyMask(
        {
          data: "/",
          delimiter: " - ",
          inputType: "insertText",
          mask: "mdy",
          mode: "single",
          previousText: "12",
          selectionEnd: 2,
          selectionStart: 2,
          text: "12/",
        },
        "single",
        " - ",
      ),
    ).toEqual({
      selectionEnd: 3,
      selectionStart: 3,
      text: "12/",
    });

    expect(
      applyMask(
        {
          data: "-",
          delimiter: " - ",
          inputType: "insertText",
          mask: "iso",
          mode: "range",
          previousText: "2025",
          selectionEnd: 4,
          selectionStart: 4,
          text: "2025-",
        },
        "range",
        " - ",
      ),
    ).toEqual({
      selectionEnd: 5,
      selectionStart: 5,
      text: "2025-",
    });

    expect(
      applyMask(
        {
          data: null,
          delimiter: " - ",
          inputType: "deleteContentBackward",
          mask: "mdy",
          mode: "single",
          previousText: "12/",
          selectionEnd: 3,
          selectionStart: 3,
          text: "12",
        },
        "single",
        " - ",
      ),
    ).toEqual({
      selectionEnd: 2,
      selectionStart: 2,
      text: "12",
    });
  });

  it("coordinates trigger, input, dialog content, and embedded calendar selection", async () => {
    defineDatepickerElements();
    const root = renderSingleDatepicker();
    await flush();

    const label = root.querySelector("aria-datepicker-label")!;
    const trigger = root.querySelector<HTMLElement>("aria-datepicker-trigger")!;
    const content = datepickerContent();
    const input = inputControl(root.querySelector("aria-datepicker-input")!);

    expect(content.parentElement).toBe(document.body);
    const portal = root.querySelector<HTMLElement>('aria-portal[data-datepicker-portal="content"]');
    expect(portal?.getAttribute("data-datepicker-portal-content")).toBe(content.id);

    expect(input.value).toBe("01/20/2025");
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("data-state")).toBe("closed");
    expect(trigger.getAttribute("data-has-value")).toBe("true");
    expect(content.hidden).toBe(true);

    trigger.click();
    await flush();

    expect(root.open).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("data-state")).toBe("open");
    expect(content.hidden).toBe(false);
    expect(content.getAttribute("role")).toBe("dialog");
    expect(content.getAttribute("aria-modal")).toBe("true");
    expect(content.getAttribute("aria-labelledby")).toBe(label.id);
    expect(content.querySelector("aria-calendar-header-month")?.textContent).toBe("January");
    expect(content.querySelector("aria-calendar-header-year")?.textContent).toBe("2025");

    enabledCell(content, "2025-01-25")?.click();
    await flush();

    expect(root.value).toBe("2025-01-25");
    expect(input.value).toBe("01/25/2025");
    expect(root.open).toBe(false);
    expect(content.hidden).toBe(true);
    expect(document.activeElement).toBe(input);
  });

  it("keeps interactions in portaled content inside the Datepicker dismissal boundary", async () => {
    defineDatepickerElements();
    document.body.innerHTML = `
      <button id="outside">Outside</button>
      <aria-datepicker>
        <aria-datepicker-trigger>Choose</aria-datepicker-trigger>
        <aria-datepicker-content><div>Calendar</div></aria-datepicker-content>
      </aria-datepicker>
    `;
    const root = document.querySelector("aria-datepicker") as DatepickerRootElement;
    const trigger = root.querySelector<HTMLElement>("aria-datepicker-trigger")!;
    const content = datepickerContent();
    const outside = document.querySelector<HTMLElement>("#outside")!;
    await flush();

    trigger.click();
    await flush();
    content.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await flush();

    expect(root.open).toBe(true);

    outside.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await flush();

    expect(root.open).toBe(false);
  });

  it("preserves portaled content ownership when the Datepicker root is reparented", async () => {
    defineDatepickerElements();
    const root = renderSingleDatepicker();
    await flush();
    const content = datepickerContent();
    const container = document.createElement("div");
    document.body.append(container);

    container.append(root);
    await flush();

    const trigger = root.querySelector<HTMLElement>("aria-datepicker-trigger")!;
    trigger.click();
    await flush();

    expect(content.parentElement).toBe(document.body);
    expect(content.hidden).toBe(false);
    expect(root.open).toBe(true);
  });

  it("positions content through @ariaui-web/position and flips when the boundary overflows", async () => {
    defineDatepickerElements();
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(320);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(260);

    const root = renderSingleDatepicker();
    await flush();

    const trigger = root.querySelector<HTMLElement>("aria-datepicker-trigger")!;
    const content = datepickerContent();
    const triggerRow = trigger.parentElement!;

    vi.spyOn(triggerRow, "getBoundingClientRect").mockReturnValue(rect(24, 220, 248, 36));
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue(rect(256, 230, 16, 16));
    vi.spyOn(content, "getBoundingClientRect").mockReturnValue(rect(0, 0, 248, 120));

    trigger.click();
    await flush();

    expect(content.hidden).toBe(false);
    expect(content.style.position).toBe("fixed");
    expect(content.style.left).toBe("24px");
    expect(content.style.top).toBe("92px");
    expect(content.dataset.side).toBe("top");
    expect(content.dataset.align).toBe("start");
    expect(content.style.visibility).toBe("visible");
  });

  it("uses the trigger as the positioning reference when no input group is available", async () => {
    defineDatepickerElements();
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(400);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(400);

    document.body.innerHTML = `
      <aria-datepicker mode="single">
        <aria-datepicker-trigger>Choose</aria-datepicker-trigger>
        <aria-datepicker-content>
          <div>Calendar</div>
        </aria-datepicker-content>
      </aria-datepicker>
    `;
    const root = document.querySelector("aria-datepicker") as DatepickerRootElement;
    await flush();

    const trigger = root.querySelector<HTMLElement>("aria-datepicker-trigger")!;
    const content = datepickerContent();

    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue(rect(40, 80, 96, 32));
    vi.spyOn(content, "getBoundingClientRect").mockReturnValue(rect(0, 0, 160, 80));

    trigger.click();
    await flush();

    expect(content.style.position).toBe("fixed");
    expect(content.style.left).toBe("40px");
    expect(content.style.top).toBe("120px");
    expect(content.dataset.side).toBe("bottom");
    expect(content.dataset.align).toBe("start");
  });

  it("keeps range mode open after the first endpoint and closes after the second", async () => {
    defineDatepickerElements();
    const root = renderRangeDatepicker();
    await flush();

    const trigger = root.querySelector<HTMLElement>("aria-datepicker-trigger")!;
    const input = inputControl(root.querySelector("aria-datepicker-input")!);

    input.value = "0120202501252025";
    input.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      data: "0120202501252025",
      inputType: "insertFromPaste",
    }));
    input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    await flush();

    expect(input.value).toBe("01/20/2025 - 01/25/2025");
    expect(root.value).toBe("2025-01-20,2025-01-25");

    root.value = "";
    input.value = "";
    trigger.click();
    await flush();

    enabledCell(datepickerContent(), "2025-01-10")?.click();
    await flush();

    expect(root.value).toBe("2025-01-10");
    expect(root.open).toBe(true);

    enabledCell(datepickerContent(), "2025-01-15")?.click();
    await flush();

    expect(root.value).toBe("2025-01-10,2025-01-15");
    expect(root.open).toBe(false);
  });
});
