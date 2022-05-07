import { IsInt, IsISO8601 } from "class-validator";

export class AddTimestampDto<T = string> {
  @IsInt({
    message: "InvalidUserId",
  })
  readonly userId: number;
  @IsISO8601({
    message: "InvalidTimestamp",
  })
  readonly timestamp: T;
}
