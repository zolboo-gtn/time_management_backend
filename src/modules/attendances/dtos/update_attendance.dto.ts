import { IsArray, IsDateString } from "class-validator";

export class UpdateAttendanceDto {
  @IsArray()
  @IsDateString({
    each: true,
    message: "InvalidTimestamp",
  })
  readonly timestamps: string[];
}
