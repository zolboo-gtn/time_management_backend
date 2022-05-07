import { IsInt, IsDateString } from "class-validator";

export class AddTimestampDto<T = string> {
  @IsInt({
    message: "InvalidUserId",
  })
  readonly userId: number;
  // @IsDateString({
  //   message: "InvalidTimestamp",
  // })
  readonly timestamp: T;
}
