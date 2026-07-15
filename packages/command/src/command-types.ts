export type CommandFilter = (
  value: string,
  search: string,
  keywords?: string[],
) => boolean | number;

export type CommandItemRecord = {
  disabled: boolean;
  element: HTMLElement;
  forceMount: boolean;
  groupId: string | null;
  id: string;
  keywords: string[];
  onSelect?: (value: string) => void;
  value: string;
};

export type CommandGroupRecord = {
  element: HTMLElement;
  forceMount: boolean;
  headingId: string | null;
  id: string;
};

export type CommandRootState = {
  activeId: string | null;
  defaultSearchValueApplied: boolean;
  defaultValueApplied: boolean;
  groups: Map<string, CommandGroupRecord>;
  items: Map<string, CommandItemRecord>;
  labelId: string | null;
  syncing: boolean;
};

export type CommandRootElement = HTMLElement & {
  filter?: CommandFilter;
  onSearchValueChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  searchValue: string;
  syncCommandTreeFromRoot?: () => void;
  value: string;
};

export type CommandOptionElement = HTMLElement & {
  onSelect?: (value: string) => void;
};
