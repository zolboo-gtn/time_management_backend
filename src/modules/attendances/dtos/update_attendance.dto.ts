import { IsArray, IsISO8601 } from "class-validator";

export class UpdateAttendanceDto<T = string> {
  @IsArray()
  @IsISO8601({
    each: true,
    message: "InvalidTimestamp",
  })
  readonly timestamps: T[];
}
