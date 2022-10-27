import { AttendanceStatus, AttendanceType } from "@prisma/client";
import { IsDateString, IsOptional, IsString, Matches } from "class-validator";
export class SendRequestDto {
  @IsDateString(undefined, { message: "InvalidStartDate" })
  readonly start: string;

  @IsDateString(undefined, { message: "InvalidEndDate" })
  readonly end: string;

  @IsString({ message: "InvalidAttendanceType" })
  readonly type: AttendanceType;

  @IsString({ message: "InvalidComment" })
  readonly comment: string;
}

export class UpdateRequestDto {
  @IsDateString(undefined, { message: "InvalidStartDate" })
  @IsOptional()
  readonly start: string;

  @IsDateString(undefined, { message: "InvalidEndDate" })
  @IsOptional()
  readonly end: string;

  @IsOptional()
  readonly type: AttendanceType;

  @IsOptional()
  readonly comment: string;
}

export class EvaluateRequestDto {
  @Matches(/^(APPROVED|DECLINED)$/, {
    message: "InvalidAttendanceType",
  })
  readonly status: AttendanceStatus;
}
