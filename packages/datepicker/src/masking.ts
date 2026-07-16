import type {
  DatepickerInputMaskPreset,
  DatepickerMaskInputArgs,
  DatepickerMaskResult,
  DatepickerMode,
} from "./types";

type BuiltInMaskPreset = Exclude<DatepickerInputMaskPreset, "custom">;
type DatepickerMaskMode = DatepickerMode;

type SlotToken = {
  type: "slot";
  slotIndex: number;
  section: "first" | "second";
};

type LiteralToken = {
  type: "literal";
  value: string;
  section: "first" | "second" | "delimiter";
};

type MaskToken = SlotToken | LiteralToken;

interface MaskLayout {
  tokens: MaskToken[];
  slotCount: number;
  firstSectionSlots: number[];
  secondSectionSlots: number[];
}

interface RenderResult {
  text: string;
  slotPositions: Map<number, number>;
  visibleSlots: number[];
}

const mdySegments = [2, 2, 4] as const;
const isoSegments = [4, 2, 2] as const;

function digitsOnly(text: string) {
  return text.replace(/\D/g, "");
}

function isDigit(character: string | undefined) {
  return character !== undefined && /\d/.test(character);
}

function getPresetConfig(preset: BuiltInMaskPreset) {
  if (preset === "iso") {
    return {
      segments: isoSegments,
      separator: "-",
    };
  }

  return {
    segments: mdySegments,
    separator: "/",
  };
}

function buildDateTokens(
  preset: BuiltInMaskPreset,
  slotOffset: number,
  section: "first" | "second",
) {
  const { segments, separator } = getPresetConfig(preset);
  const tokens: MaskToken[] = [];
  const slots: number[] = [];
  let slotIndex = slotOffset;

  segments.forEach((segmentLength, segmentIndex) => {
    for (let index = 0; index < segmentLength; index += 1) {
      tokens.push({ type: "slot", slotIndex, section });
      slots.push(slotIndex);
      slotIndex += 1;
    }

    if (segmentIndex < segments.length - 1) {
      tokens.push({ type: "literal", value: separator, section });
    }
  });

  return { tokens, slots };
}

function createMaskLayout(
  mode: DatepickerMaskMode,
  preset: BuiltInMaskPreset,
  delimiter: string,
): MaskLayout {
  const first = buildDateTokens(preset, 0, "first");

  if (mode === "single") {
    return {
      tokens: first.tokens,
      slotCount: first.slots.length,
      firstSectionSlots: first.slots,
      secondSectionSlots: [],
    };
  }

  const second = buildDateTokens(preset, first.slots.length, "second");
  const delimiterTokens = delimiter.split("").map<LiteralToken>((value) => ({
    type: "literal",
    value,
    section: "delimiter",
  }));

  return {
    tokens: [...first.tokens, ...delimiterTokens, ...second.tokens],
    slotCount: first.slots.length + second.slots.length,
    firstSectionSlots: first.slots,
    secondSectionSlots: second.slots,
  };
}

function createEmptySlots(slotCount: number) {
  return Array.from({ length: slotCount }, () => "");
}

function textToSlots(layout: MaskLayout, text: string) {
  const slots = createEmptySlots(layout.slotCount);
  let cursor = 0;

  for (const token of layout.tokens) {
    const character = text[cursor];

    if (!character) {
      break;
    }

    if (token.type === "slot") {
      if (isDigit(character)) {
        slots[token.slotIndex] = character;
        cursor += 1;
        continue;
      }

      if (character === " ") {
        cursor += 1;
        continue;
      }

      continue;
    }

    if (character === token.value) {
      cursor += 1;
    }
  }

  return slots;
}

function getLastFilledSlot(sectionSlots: number[], slots: string[]) {
  for (let index = sectionSlots.length - 1; index >= 0; index -= 1) {
    const slotIndex = sectionSlots[index];
    if (slotIndex != null && slots[slotIndex]) {
      return slotIndex;
    }
  }

  return undefined;
}

function renderSection(
  tokens: MaskToken[],
  slots: string[],
  lastFilledSlot: number | undefined,
  output: RenderResult,
) {
  if (lastFilledSlot == null) {
    return;
  }

  for (const token of tokens) {
    if (token.type === "slot") {
      output.slotPositions.set(token.slotIndex, output.text.length);
      output.visibleSlots.push(token.slotIndex);
      output.text += slots[token.slotIndex] || " ";

      if (token.slotIndex === lastFilledSlot) {
        break;
      }

      continue;
    }

    output.text += token.value;
  }
}

function renderSlots(layout: MaskLayout, slots: string[]): RenderResult {
  const output: RenderResult = {
    text: "",
    slotPositions: new Map<number, number>(),
    visibleSlots: [],
  };
  const firstLastFilledSlot = getLastFilledSlot(layout.firstSectionSlots, slots);
  const secondLastFilledSlot = getLastFilledSlot(layout.secondSectionSlots, slots);
  const firstTokens = layout.tokens.filter((token) => token.section === "first");
  const secondTokens = layout.tokens.filter((token) => token.section === "second");
  const delimiterTokens = layout.tokens.filter(
    (token): token is LiteralToken => token.section === "delimiter",
  );

  renderSection(firstTokens, slots, firstLastFilledSlot, output);

  if (secondLastFilledSlot != null) {
    for (const token of delimiterTokens) {
      output.text += token.value;
    }

    renderSection(secondTokens, slots, secondLastFilledSlot, output);
  }

  return output;
}

function findSlotAtOrAfterPosition(rendered: RenderResult, position: number, slots: string[]) {
  for (const slotIndex of rendered.visibleSlots) {
    const slotPosition = rendered.slotPositions.get(slotIndex);

    if (slotPosition != null && slotPosition >= position) {
      return slotIndex;
    }
  }

  if (position >= rendered.text.length) {
    const lastVisibleSlot = rendered.visibleSlots[rendered.visibleSlots.length - 1];

    if (lastVisibleSlot == null) {
      return 0;
    }

    for (let slotIndex = lastVisibleSlot + 1; slotIndex < slots.length; slotIndex += 1) {
      if (!slots[slotIndex]) {
        return slotIndex;
      }
    }
  }

  return undefined;
}

function findSlotBeforePosition(rendered: RenderResult, position: number) {
  let previousSlot: number | undefined;

  for (const slotIndex of rendered.visibleSlots) {
    const slotPosition = rendered.slotPositions.get(slotIndex);

    if (slotPosition == null || slotPosition >= position) {
      break;
    }

    previousSlot = slotIndex;
  }

  return previousSlot;
}

function getSelectedSlots(
  rendered: RenderResult,
  selectionStart: number,
  selectionEnd: number,
) {
  return rendered.visibleSlots.filter((slotIndex) => {
    const slotPosition = rendered.slotPositions.get(slotIndex);
    return slotPosition != null && slotPosition >= selectionStart && slotPosition < selectionEnd;
  });
}

function getSelectionForSlot(rendered: RenderResult, slotIndex: number | undefined) {
  if (slotIndex == null) {
    return {
      selectionStart: rendered.text.length,
      selectionEnd: rendered.text.length,
    };
  }

  const slotPosition = rendered.slotPositions.get(slotIndex) ?? rendered.text.length;

  return {
    selectionStart: slotPosition,
    selectionEnd: slotPosition,
  };
}

function getSelectionAfterSlot(rendered: RenderResult, slotIndex: number) {
  for (const visibleSlot of rendered.visibleSlots) {
    if (visibleSlot > slotIndex) {
      const slotPosition = rendered.slotPositions.get(visibleSlot) ?? rendered.text.length;
      return {
        selectionStart: slotPosition,
        selectionEnd: slotPosition,
      };
    }
  }

  return {
    selectionStart: rendered.text.length,
    selectionEnd: rendered.text.length,
  };
}

function getInsertedDigits(args: DatepickerMaskInputArgs) {
  const dataDigits = digitsOnly(args.data ?? "");

  if (dataDigits) {
    return dataDigits;
  }

  return digitsOnly(args.text);
}

function applyInsert(
  slots: string[],
  rendered: RenderResult,
  selectionStart: number,
  selectionEnd: number,
  insertedDigits: string,
) {
  if (!insertedDigits) {
    return undefined;
  }

  const selectedSlots = getSelectedSlots(rendered, selectionStart, selectionEnd);
  const startSlot =
    selectedSlots[0] ?? findSlotAtOrAfterPosition(rendered, selectionStart, slots);

  if (startSlot == null) {
    return undefined;
  }

  if (selectedSlots.length > 0) {
    selectedSlots.forEach((slotIndex) => {
      slots[slotIndex] = "";
    });
  }

  let slotIndex = startSlot;

  for (const digit of insertedDigits) {
    if (slotIndex >= slots.length) {
      break;
    }

    slots[slotIndex] = digit;
    slotIndex += 1;
  }

  return {
    slots,
    nextSlotIndex: slotIndex - 1,
    moveAfter: true,
  };
}

function applyBackspace(
  slots: string[],
  rendered: RenderResult,
  selectionStart: number,
  selectionEnd: number,
) {
  const selectedSlots = getSelectedSlots(rendered, selectionStart, selectionEnd);

  if (selectedSlots.length > 0) {
    selectedSlots.forEach((slotIndex) => {
      slots[slotIndex] = "";
    });

    return {
      slots,
      nextSlotIndex: selectedSlots[0],
      moveAfter: false,
    };
  }

  const targetSlot = findSlotBeforePosition(rendered, selectionStart);

  if (targetSlot == null) {
    return undefined;
  }

  slots[targetSlot] = "";

  return {
    slots,
    nextSlotIndex: targetSlot,
    moveAfter: false,
  };
}

function applyDelete(
  slots: string[],
  rendered: RenderResult,
  selectionStart: number,
  selectionEnd: number,
) {
  const selectedSlots = getSelectedSlots(rendered, selectionStart, selectionEnd);

  if (selectedSlots.length > 0) {
    selectedSlots.forEach((slotIndex) => {
      slots[slotIndex] = "";
    });

    return {
      slots,
      nextSlotIndex: selectedSlots[0],
      moveAfter: false,
    };
  }

  const targetSlot = findSlotAtOrAfterPosition(rendered, selectionStart, slots);

  if (targetSlot == null) {
    return undefined;
  }

  slots[targetSlot] = "";

  return {
    slots,
    nextSlotIndex: targetSlot,
    moveAfter: false,
  };
}

function applyBuiltInEdit(
  args: DatepickerMaskInputArgs,
  mode: DatepickerMaskMode,
  preset: BuiltInMaskPreset,
  delimiter: string,
) {
  const layout = createMaskLayout(mode, preset, delimiter);
  const previousSlots = textToSlots(layout, args.previousText);
  const renderedBeforeEdit = renderSlots(layout, previousSlots);
  const selectionStart = args.selectionStart ?? renderedBeforeEdit.text.length;
  const selectionEnd = args.selectionEnd ?? selectionStart;
  const nextSlots = [...previousSlots];

  if (args.inputType === "deleteContentBackward") {
    return applyBackspace(nextSlots, renderedBeforeEdit, selectionStart, selectionEnd);
  }

  if (args.inputType === "deleteContentForward") {
    return applyDelete(nextSlots, renderedBeforeEdit, selectionStart, selectionEnd);
  }

  if (args.inputType?.startsWith("insert")) {
    return applyInsert(
      nextSlots,
      renderedBeforeEdit,
      selectionStart,
      selectionEnd,
      getInsertedDigits(args),
    );
  }

  return undefined;
}

function formatBuiltInFromDigits(
  digits: string,
  preset: BuiltInMaskPreset,
  mode: DatepickerMaskMode,
  delimiter: string,
) {
  const layout = createMaskLayout(mode, preset, delimiter);
  const slots = createEmptySlots(layout.slotCount);

  digits
    .slice(0, layout.slotCount)
    .split("")
    .forEach((digit, index) => {
      slots[index] = digit;
    });

  return renderSlots(layout, slots).text;
}

export function formatMaskedDateDigits(
  digits: string,
  preset: BuiltInMaskPreset,
) {
  return formatBuiltInFromDigits(digits, preset, "single", " - ");
}

export function applyBuiltInMask(
  text: string,
  mode: DatepickerMaskMode,
  preset: BuiltInMaskPreset,
  delimiter: string,
) {
  return formatBuiltInFromDigits(digitsOnly(text), preset, mode, delimiter);
}

export function getDefaultSelection(text: string): Pick<
  DatepickerMaskResult,
  "selectionStart" | "selectionEnd"
> {
  return {
    selectionStart: text.length,
    selectionEnd: text.length,
  };
}

export function applyMask(
  args: DatepickerMaskInputArgs,
  mode: DatepickerMaskMode,
  delimiter: string,
) {
  if (args.maskInput) {
    return args.maskInput(args);
  }

  if (args.mask === "custom") {
    return {
      text: args.text,
      ...getDefaultSelection(args.text),
    };
  }

  const appliedEdit = applyBuiltInEdit(args, mode, args.mask, delimiter);

  if (!appliedEdit) {
    const maskedText = applyBuiltInMask(args.text, mode, args.mask, delimiter);

    return {
      text: maskedText,
      ...getDefaultSelection(maskedText),
    };
  }

  const renderedAfterEdit = renderSlots(
    createMaskLayout(mode, args.mask, delimiter),
    appliedEdit.slots,
  );

  const nextSlotIndex = appliedEdit.nextSlotIndex ?? 0;

  return {
    text: renderedAfterEdit.text,
    ...(appliedEdit.moveAfter
      ? getSelectionAfterSlot(renderedAfterEdit, nextSlotIndex)
      : getSelectionForSlot(renderedAfterEdit, nextSlotIndex)),
  };
}
