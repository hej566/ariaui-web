export type DatepickerMode = "single" | "range" | "dual-range";

export interface DatepickerRangeValue {
  start?: Date;
  end?: Date;
}

export type DatepickerValue = Date | DatepickerRangeValue | undefined;
export type DatepickerInputMaskPreset = "mdy" | "iso" | "custom";

export type DatepickerParseInput = (
  text: string,
  mode: DatepickerMode,
  delimiter: string,
) => DatepickerValue;

export type DatepickerFormatInput = (
  value: DatepickerValue,
  mode: DatepickerMode,
) => string;

export interface DatepickerMaskInputArgs {
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
}

export interface DatepickerMaskResult {
  text: string;
  selectionStart?: number | null;
  selectionEnd?: number | null;
}

export type DatepickerMaskInput = (
  args: Omit<DatepickerMaskInputArgs, "maskInput">,
) => DatepickerMaskResult;
