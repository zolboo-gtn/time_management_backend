import { AttendanceType } from "@prisma/client";
import { Matches } from "class-validator";

export class StartWorkDto {
  @Matches(/^(OFFICE|REMOTE)$/, {
    message: "InvalidAttendanceType",
  })
  readonly type: AttendanceType;
}
