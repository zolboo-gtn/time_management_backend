import { PickType } from "@nestjs/mapped-types";
import { IsDateString, IsOptional } from "class-validator";

import { UserAttendanceDto } from "./user_attendance.dto";

export class MonthlyAttendanceDto extends PickType(UserAttendanceDto, [
  "userId",
]) {
  @IsDateString(undefined, {
    message: "InvalidDate",
  })
  @IsOptional()
  readonly date?: string;
}
