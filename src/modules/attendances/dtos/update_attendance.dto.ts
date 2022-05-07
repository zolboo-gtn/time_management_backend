import { IsDateString } from "class-validator";

export class UpdateAttendanceDto {
  @IsDateString({
    each: true,
    message: "InvalidTimestamp",
  })
  readonly timestamps: string[];
}
