import { IsDateString } from "class-validator";

export class CreateRemoteSheetDto {
  @IsDateString(undefined, { message: "InvalidStartDate" })
  readonly date: string;
}
