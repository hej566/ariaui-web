import type { CommandFilter, CommandItemRecord } from "./command-types";

export const defaultCommandFilter: CommandFilter = (value, search, keywords = []) => {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) {
    return 1;
  }

  return [value, ...keywords].join(" ").toLowerCase().includes(normalizedSearch) ? 1 : 0;
};

export function getCommandScore(filter: CommandFilter, item: CommandItemRecord, search: string) {
  const result = filter(item.value, search, item.keywords);
  return typeof result === "number" ? result : result ? 1 : 0;
}

export function isCommandItemVisible(
  item: CommandItemRecord,
  searchValue: string,
  shouldFilter: boolean,
  filter: CommandFilter,
) {
  if (item.forceMount) {
    return true;
  }

  if (!shouldFilter || !searchValue) {
    return true;
  }

  return getCommandScore(filter, item, searchValue) > 0;
}
