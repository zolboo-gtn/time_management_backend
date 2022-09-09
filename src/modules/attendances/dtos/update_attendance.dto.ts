import { IsDateString } from "class-validator";

export class UpdateCardAttendanceDto {
  @IsDateString(
    { strict: true },
    {
      each: true,
      message: "InvalidTimestamp",
    },
  )
  readonly timestamps: string[];
}
