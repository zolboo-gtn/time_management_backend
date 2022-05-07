import { IsDateString } from "class-validator";

export class UpdateAttendanceDto<T = string> {
  // @IsDateString({
  //   each: true,
  //   message: "InvalidTimestamp",
  // })
  readonly timestamps: T[];
}
