import { AriaWebElement } from "@ariaui-web/utils";
import {
  handleCalendarCellClick,
  handleCalendarCellFocus,
  handleCalendarCellKeyDown,
  handleCalendarHeaderNext,
  handleCalendarHeaderPrevious,
  handleCalendarSelectClick,
} from "./calendar-actions";
import { disconnectCalendarTree, observeCalendarTree, syncCalendarTreeAround } from "./calendar-sync";

export class CalendarElement extends AriaWebElement {
  static override packageSlug = "calendar";
  #calendarEventsBound = false;

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "data-calendar-pane",
      "date",
      "default-dates",
      "mode",
      "outside-month",
      "selected-dates",
      "visible-month",
    ]));
  }

  get mode() {
    return this.getAttribute("mode") ?? "single";
  }

  set mode(value: string) {
    if (value == null) {
      this.removeAttribute("mode");
    } else {
      this.setAttribute("mode", String(value));
    }
  }

  get visibleMonth() {
    return this.getAttribute("visible-month") ?? "";
  }

  set visibleMonth(value: string) {
    if (value == null) {
      this.removeAttribute("visible-month");
    } else {
      this.setAttribute("visible-month", String(value));
    }
  }

  get date() {
    return this.getAttribute("date") ?? "";
  }

  set date(value: string) {
    if (value == null) {
      this.removeAttribute("date");
    } else {
      this.setAttribute("date", String(value));
    }
  }

  get isOutsideMonth() {
    return this.hasAttribute("outside-month") || this.getAttribute("data-outside-month") === "true";
  }

  set isOutsideMonth(value: boolean) {
    if (value) {
      this.setAttribute("outside-month", "");
    } else {
      this.removeAttribute("outside-month");
      this.removeAttribute("data-outside-month");
    }
  }

  calendarPartName() {
    return (this.constructor as typeof CalendarElement).partName;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.bindCalendarEvents();

    if (this.calendarPartName() === "Root") {
      observeCalendarTree(this);
    }

    syncCalendarTreeAround(this);
  }

  disconnectedCallback() {
    if (this.calendarPartName() === "Root") {
      disconnectCalendarTree(this);
    }
  }

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    syncCalendarTreeAround(this);
  }

  override afterAriaWebContractApplied() {
    syncCalendarTreeAround(this);
  }

  bindCalendarEvents() {
    if (this.#calendarEventsBound) {
      return;
    }

    const partName = this.calendarPartName();

    if (partName === "Cell") {
      this.addEventListener("click", this.handleCalendarCellClick);
      this.addEventListener("focus", this.handleCalendarCellFocus);
      this.addEventListener("keydown", this.handleCalendarCellKeyDown);
    }

    if (partName === "HeaderPrevious") {
      this.addEventListener("click", this.handleCalendarPreviousClick);
    }

    if (partName === "HeaderNext") {
      this.addEventListener("click", this.handleCalendarNextClick);
    }

    if (partName === "MonthSelect" || partName === "YearSelect") {
      this.addEventListener("click", this.handleCalendarSelectClick);
    }

    this.#calendarEventsBound = true;
  }

  handleCalendarCellClick = (event: Event) => {
    handleCalendarCellClick(this, event);
  };

  handleCalendarCellFocus = () => {
    handleCalendarCellFocus(this);
  };

  handleCalendarCellKeyDown = (event: Event) => {
    handleCalendarCellKeyDown(this, event as KeyboardEvent);
  };

  handleCalendarPreviousClick = (event: Event) => {
    handleCalendarHeaderPrevious(this, event);
  };

  handleCalendarNextClick = (event: Event) => {
    handleCalendarHeaderNext(this, event);
  };

  handleCalendarSelectClick = (event: Event) => {
    handleCalendarSelectClick(this, event);
  };
}
