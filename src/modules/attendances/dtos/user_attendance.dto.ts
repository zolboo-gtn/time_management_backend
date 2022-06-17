import { ApiPropertyOptional } from "@nestjs/swagger";

import { Type } from "class-transformer";
import {
  IsInt,
  IsDateString,
  IsOptional,
  Validate,
  IsEnum,
} from "class-validator";

import { SortingOrder } from "common/enums";
import { IsBeforeConstraint } from "common/validators";
import { SortingField } from "modules/users/enums";

export class UserAttendanceDto {
  @IsInt({
    message: "InvalidUserId",
  })
  @Type(() => Number)
  readonly userId: number;

  @IsDateString(undefined, { message: "InvalidStartDate" })
  @Validate(IsBeforeConstraint, ["endDate"], {
    message: "StartDateMustBeBeforeEndDate",
  })
  @IsOptional()
  readonly startDate?: string;

  @IsDateString(undefined, {
    message: "InvalidEndDate",
  })
  @IsOptional()
  readonly endDate?: string;

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

  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  readonly page?: number;

  @ApiPropertyOptional({ type: Number, example: 20 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  readonly perPage?: number;
}
