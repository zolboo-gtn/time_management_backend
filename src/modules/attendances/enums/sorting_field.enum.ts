export const SortingField = {
  CREATEDAT: "createdAt",
  ID: "id",
} as const;

export type SortingField = typeof SortingField[keyof typeof SortingField];
