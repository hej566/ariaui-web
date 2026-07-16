import { applyMask } from "./masking";
import type {
  DatepickerFormatInput,
  DatepickerInputMaskPreset,
  DatepickerMaskInput,
  DatepickerMode,
  DatepickerParseInput,
  DatepickerValue,
} from "./types";

export function getDefaultCloseOnSelect(mode: DatepickerMode) {
  return mode === "single";
}

export function isValidDate(value: Date) {
  return !Number.isNaN(value.getTime());
}

export function parseMonthDayYear(text: string) {
  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return undefined;
  }

  const [, monthString, dayString, yearString] = match;
  const month = Number(monthString);
  const day = Number(dayString);
  const year = Number(yearString);
  const nextDate = new Date(year, month - 1, day);

  if (
    !isValidDate(nextDate)
    || nextDate.getFullYear() !== year
    || nextDate.getMonth() !== month - 1
    || nextDate.getDate() !== day
  ) {
    return undefined;
  }

  return nextDate;
}

export function parseIsoDate(text: string) {
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return undefined;
  }

  const [, yearString, monthString, dayString] = match;
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  const nextDate = new Date(year, month - 1, day);

  if (
    !isValidDate(nextDate)
    || nextDate.getFullYear() !== year
    || nextDate.getMonth() !== month - 1
    || nextDate.getDate() !== day
  ) {
    return undefined;
  }

  return nextDate;
}

export function parseDateText(text: string) {
  return parseMonthDayYear(text) ?? parseIsoDate(text);
}

export function padDatePart(value: number) {
  return value.toString().padStart(2, "0");
}

export function formatDatePart(value: Date) {
  return `${value.getFullYear()}-${padDatePart(value.getMonth() + 1)}-${padDatePart(value.getDate())}`;
}

export function formatDateValue(
  value: Date,
  inputMask: DatepickerInputMaskPreset | undefined,
) {
  if (inputMask === "iso") {
    return formatDatePart(value);
  }

  return `${padDatePart(value.getMonth() + 1)}/${padDatePart(value.getDate())}/${value.getFullYear()}`;
}

export function defaultParseInput(
  text: string,
  mode: DatepickerMode,
  delimiter: string,
): DatepickerValue {
  if (mode === "single") {
    const trimmedText = text.trim();
    if (trimmedText === "") {
      return undefined;
    }

    return parseDateText(trimmedText);
  }

  const trimmedText = text.trim();
  if (trimmedText === "") {
    return undefined;
  }

  const [startText, endText, ...rest] = trimmedText.split(delimiter);
  if (rest.length > 0 || !startText?.trim() || !endText?.trim()) {
    return undefined;
  }

  const start = parseDateText(startText.trim());
  const end = parseDateText(endText.trim());

  if (!start || !end) {
    return undefined;
  }

  return { start, end };
}

export function defaultFormatInput(
  value: DatepickerValue,
  mode: DatepickerMode,
  inputMask: DatepickerInputMaskPreset | undefined,
  delimiter: string,
) {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return formatDateValue(value, inputMask);
  }

  if (mode !== "single" && (value.start || value.end)) {
    const start = value.start ? formatDateValue(value.start, inputMask) : "";
    const end = value.end ? formatDateValue(value.end, inputMask) : "";

    if (start && end) {
      return `${start}${delimiter}${end}`;
    }

    if (start) {
      return `${start}${delimiter}`;
    }
  }

  return "";
}

export function createResolvedFormatInput(
  formatInput: DatepickerFormatInput | undefined,
  inputMask: DatepickerInputMaskPreset | undefined,
  maskDelimiter: string,
): DatepickerFormatInput {
  return (nextValue, currentMode) => {
    if (formatInput) {
      return formatInput(nextValue, currentMode);
    }

    return defaultFormatInput(nextValue, currentMode, inputMask, maskDelimiter);
  };
}

export function resolveVisibleMonthFromValue(value: DatepickerValue) {
  if (value instanceof Date) {
    return value;
  }

  if (value?.start instanceof Date) {
    return value.start;
  }

  if (value?.end instanceof Date) {
    return value.end;
  }

  return undefined;
}

export function createApplyInputMask({
  mode,
  inputMask,
  maskDelimiter,
  maskInput,
}: {
  mode: DatepickerMode;
  inputMask?: DatepickerInputMaskPreset;
  maskDelimiter: string;
  maskInput?: DatepickerMaskInput;
}) {
  return ({
    text,
    previousText,
    selectionStart,
    selectionEnd,
    inputType,
    data,
  }: {
    text: string;
    previousText: string;
    selectionStart: number | null;
    selectionEnd: number | null;
    inputType?: string;
    data?: string | null;
  }) => {
    if (!inputMask) {
      return {
        text,
        selectionStart: text.length,
        selectionEnd: text.length,
      };
    }

    const args = {
      text,
      mode,
      mask: inputMask,
      delimiter: maskDelimiter,
      selectionStart,
      selectionEnd,
      previousText,
    } satisfies {
      text: string;
      mode: DatepickerMode;
      mask: DatepickerInputMaskPreset;
      delimiter: string;
      selectionStart: number | null;
      selectionEnd: number | null;
      previousText: string;
      inputType?: string;
      data?: string | null;
      maskInput?: DatepickerMaskInput;
    };
    const maskArgs: typeof args & {
      inputType?: string;
      data?: string | null;
      maskInput?: DatepickerMaskInput;
    } = { ...args };

    if (inputType !== undefined) {
      maskArgs.inputType = inputType;
    }
    if (data !== undefined) {
      maskArgs.data = data;
    }
    if (maskInput) {
      maskArgs.maskInput = maskInput;
    }

    return applyMask(maskArgs, mode, maskDelimiter);
  };
}

export function datepickerValueToDates(value: DatepickerValue) {
  if (value instanceof Date) {
    return [value];
  }

  return [value?.start, value?.end].filter((date): date is Date => date instanceof Date);
}

export function serializeDatepickerValue(value: DatepickerValue) {
  return datepickerValueToDates(value).map(formatDatePart).join(",");
}

export function parseDatepickerValue(value: string | null | undefined, mode: DatepickerMode): DatepickerValue {
  if (!value) {
    return undefined;
  }

  const dates = value
    .split(",")
    .map((entry) => parseIsoDate(entry.trim()))
    .filter((entry): entry is Date => Boolean(entry));

  if (mode === "single") {
    return dates[0];
  }

  if (dates.length === 0) {
    return undefined;
  }

  const rangeValue: Exclude<DatepickerValue, Date | undefined> = {};
  if (dates[0]) {
    rangeValue.start = dates[0];
  }
  if (dates[1]) {
    rangeValue.end = dates[1];
  }

  return rangeValue;
}
