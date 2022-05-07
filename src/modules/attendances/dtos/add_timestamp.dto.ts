import { IsInt, IsDateString } from "class-validator";

export class AddTimestampDto {
  @IsInt({
    message: "InvalidUserId",
  })
  readonly userId: number;
  @IsDateString({
    message: "InvalidTimestamp",
  })
  readonly timestamp: string;
}
