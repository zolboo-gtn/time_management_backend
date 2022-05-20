export const SortingField = {
  CARDID: "cardId",
  CREATEDAT: "createdAt",
  EMAIL: "email",
  ID: "id",
  NAME: "name",
  ROLE: "role",
} as const;

export type SortingField = typeof SortingField[keyof typeof SortingField];
