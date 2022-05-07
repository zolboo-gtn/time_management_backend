import { IsInt, IsDate } from "class-validator";

export class AddTimestampDto<T = string> {
  @IsInt({
    message: "InvalidUserId",
  })
  readonly userId: number;
  @IsDate({
    message: "InvalidTimestamp",
  })
  readonly timestamp: T;
}
