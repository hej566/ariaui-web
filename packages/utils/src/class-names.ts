export type ClassNameParts<TParts extends string> = Partial<Record<TParts, string>>;

export function joinClassNames(...classNames: Array<string | null | undefined | false>): string {
  return classNames.filter(Boolean).join(" ");
}

export function mergeClassNames<TParts extends string>(
  defaults: ClassNameParts<TParts>,
  overrides?: ClassNameParts<TParts>,
): ClassNameParts<TParts> {
  return { ...defaults, ...(overrides ?? {}) };
}
