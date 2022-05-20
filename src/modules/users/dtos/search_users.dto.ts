import { Role } from "@prisma/client";
import { IsOptional, IsString, IsEnum } from "class-validator";

import { SortingOrder } from "common/enums";
import { SortingField } from "modules/users/enums";

export class SearchUsersDto {
  @IsString({
    message: "InvalidCardId",
  })
  @IsOptional()
  readonly cardId?: string;

  @IsString({
    message: "InvalidEmail",
  })
  @IsOptional()
  readonly email?: string;

  @IsString({
    message: "InvalidName",
  })
  @IsOptional()
  readonly name?: string;

  @IsEnum(Role, {
    message: "InvalidRole",
  })
  @IsOptional()
  readonly role?: Role;

  @IsEnum(SortingField, {
    message: "InvalidSortingField",
  })
  @IsOptional()
  readonly sortingField?: SortingField;

  @IsEnum(SortingOrder, {
    message: "InvalidSortingOrder",
  })
  @IsOptional()
  readonly sortingOrder?: SortingOrder;
}
