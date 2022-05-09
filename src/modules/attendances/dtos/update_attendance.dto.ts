import { IsDateString } from "class-validator";

export class UpdateAttendanceDto {
  @IsDateString(
    { strict: true },
    {
      each: true,
      message: "InvalidTimestamp",
    },
  )
  readonly timestamps: string[];
}
