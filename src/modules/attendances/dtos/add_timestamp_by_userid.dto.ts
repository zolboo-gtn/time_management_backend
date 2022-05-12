import { IsInt, IsDateString } from "class-validator";

export class AddTimestampByUserIdDto {
  @IsInt({
    message: "InvalidUserId",
  })
  readonly userId: number;
  @IsDateString({
    message: "InvalidTimestamp",
  })
  readonly timestamp: string;
}
