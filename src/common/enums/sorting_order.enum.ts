export const SortingOrder = {
  ASCENDING: "asc",
  DESCENDING: "desc",
} as const;

export type SortingOrder = typeof SortingOrder[keyof typeof SortingOrder];
