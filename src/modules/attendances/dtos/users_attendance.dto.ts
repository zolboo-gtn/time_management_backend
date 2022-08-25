import { PickType } from "@nestjs/mapped-types";
import { UserAttendanceDto } from "./user_attendance.dto";

export class UsersAttendanceDto extends PickType(UserAttendanceDto, [
  "startDate",
  "endDate",
  "sortingField",
  "sortingOrder",
  "page",
  "perPage",
]) {}
