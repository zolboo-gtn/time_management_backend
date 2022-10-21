import { ApiPropertyOptional } from "@nestjs/swagger";

import { Type } from "class-transformer";
import { IsInt, IsDateString, IsOptional, Validate } from "class-validator";

import { IsBeforeConstraint } from "common/validators";

export class RemoteSheetDto {
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
