import { IsDate } from "class-validator";

export class UpdateAttendanceDto<T = string> {
  @IsDate({
    each: true,
    message: "InvalidTimestamp",
  })
  readonly timestamps: T[];
}
