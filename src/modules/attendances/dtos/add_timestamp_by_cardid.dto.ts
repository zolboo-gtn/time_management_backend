import { IsDateString, IsString } from "class-validator";

export class AddTimestampByCardIdDto {
  @IsString({
    message: "InvalidCardId",
  })
  readonly cardId: string;
  @IsDateString({
    message: "InvalidTimestamp",
  })
  readonly timestamp: string;
}
