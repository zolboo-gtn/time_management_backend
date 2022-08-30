import { Injectable } from "@nestjs/common";
import { Cron, Timeout } from "@nestjs/schedule";
import { AttendancesService } from "modules/attendances";

@Injectable()
export class TaskService {
  constructor(private readonly attendanceService: AttendancesService) {}

  @Cron("0 59 23 * * *", { timeZone: "Asia/Ulaanbaatar" })
  handlePullAttendanceCron() {
    this.attendanceService.pullFromCardData();
  }
}
