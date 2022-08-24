import { AttendanceStatus, AttendanceType } from "@prisma/client";
import { IsDateString, IsOptional, Matches } from "class-validator";

export class SendRequestDto {
  @IsDateString(undefined, { message: "InvalidStartDate" })
  readonly start: string;

  @IsDateString(undefined, { message: "InvalidEndDate" })
  readonly end: string;

  @Matches(/^(HOLIDAY|DAYOFF|SICK)$/, {
    message: "InvalidAttendanceType",
  })
  readonly type: AttendanceType;
}

export class UpdateRequestDto {
  @IsDateString(undefined, { message: "InvalidStartDate" })
  @IsOptional()
  readonly start: string;

  @IsDateString(undefined, { message: "InvalidEndDate" })
  @IsOptional()
  readonly end: string;

  @Matches(/^(HOLIDAY|DAYOFF|SICK)$/, {
    message: "InvalidAttendanceType",
  })
  @IsOptional()
  readonly type: AttendanceType;
}

export class ApproveRequestDto {
  @Matches(/^(APPROVED|DECLINED)$/, {
    message: "InvalidAttendanceType",
  })
  readonly status: AttendanceStatus;
}
