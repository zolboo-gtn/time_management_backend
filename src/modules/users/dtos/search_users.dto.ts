import { ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";

import { Type } from "class-transformer";
import { IsOptional, IsString, IsEnum, IsInt } from "class-validator";

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

  @ApiPropertyOptional({ type: Number, nullable: true, example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  readonly page?: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 20 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  readonly perPage?: number | null;
}
