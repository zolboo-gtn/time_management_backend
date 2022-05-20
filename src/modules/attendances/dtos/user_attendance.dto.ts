import { Type } from "class-transformer";
import { IsInt, IsDateString, IsOptional, Validate } from "class-validator";

import { IsBeforeConstraint } from "common/validators";

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
}
